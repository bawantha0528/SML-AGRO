import {
    AlertTriangle,
    Building,
    Calendar,
    CalendarCheck,
    FileText,
    Globe,
    Loader2,
    Mail,
    MessageSquare,
    Package,
    Pencil,
    Phone,
    Plus,
    RefreshCw,
    Search,
    Tag,
    Trash2,
    X
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// ── Status config (OCP: add new statuses here without changing components) ──
const STATUS_CONFIG = {
    NEW: { label: 'New', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    RESPONDED: { label: 'Responded', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    FOLLOWUP: { label: 'Follow-Up', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    QUOTED: { label: 'Quoted', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    CLOSED: { label: 'Closed', color: 'bg-green-100 text-green-700 border-green-200' },
};

const PRIORITY_CONFIG = {
    HIGH: { label: 'High', color: 'text-red-600', dot: 'bg-red-500' },
    MEDIUM: { label: 'Medium', color: 'text-yellow-600', dot: 'bg-yellow-400' },
    LOW: { label: 'Low', color: 'text-gray-400', dot: 'bg-gray-300' },
};

// ── StatusBadge ──
function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
            {cfg.label}
        </span>
    );
}

// ── PriorityBadge ──
function PriorityBadge({ priority }) {
    const cfg = PRIORITY_CONFIG[priority] || { label: priority, color: 'text-gray-500', dot: 'bg-gray-300' };
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cfg.color}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
    Plus,
            {cfg.label}
        </span>
    );
}

function getFollowupState(inquiry) {
    const followupDate = inquiry.followupDate ? new Date(`${inquiry.followupDate}T00:00:00`) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!followupDate) {
        return { key: 'none', label: 'Not Scheduled', className: 'bg-gray-100 text-gray-600 border-gray-200' };
    }

    if (inquiry.followupCompletedAt) {
        return { key: 'completed', label: 'Completed', className: 'bg-green-100 text-green-700 border-green-200' };
    }

    if (followupDate.getTime() < today.getTime()) {
        return { key: 'overdue', label: 'Overdue', className: 'bg-red-100 text-red-700 border-red-200' };
    }

    if (followupDate.getTime() === today.getTime()) {
        return { key: 'today', label: 'Due Today', className: 'bg-orange-100 text-orange-700 border-orange-200' };
    }

    return { key: 'pending', label: 'Pending', className: 'bg-amber-100 text-amber-700 border-amber-200' };
}

function FollowupBadge({ inquiry }) {
    const state = getFollowupState(inquiry);
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${state.className}`}>
            {state.label}
        </span>
    );
}

// ── InquiryDetailPanel ──
function InquiryDetailPanel({
    inquiry,
    onClose,
    onStatusChange,
    onNoteSave,
    onFollowupSave,
    onFollowupComplete,
    currentAdminUser,
    onLoadPrivateNotes,
    onAddPrivateNote,
    onUpdatePrivateNote,
    onDeletePrivateNote,
}) {
    const [notes, setNotes] = useState(inquiry.notes || '');
    const [followupDateInput, setFollowupDateInput] = useState(inquiry.followupDate || '');
    const [privateNotes, setPrivateNotes] = useState([]);
    const [privateNotesLoading, setPrivateNotesLoading] = useState(false);
    const [privateNotesError, setPrivateNotesError] = useState('');
    const [showAddPrivateNote, setShowAddPrivateNote] = useState(false);
    const [newPrivateNoteContent, setNewPrivateNoteContent] = useState('');
    const [savingPrivateNote, setSavingPrivateNote] = useState(false);
    const [editingPrivateNoteId, setEditingPrivateNoteId] = useState(null);
    const [editingPrivateNoteContent, setEditingPrivateNoteContent] = useState('');
    const [savingEditPrivateNote, setSavingEditPrivateNote] = useState(false);
    const [deletingPrivateNoteId, setDeletingPrivateNoteId] = useState(null);
    const [privateNoteMsg, setPrivateNoteMsg] = useState('');
    const [saving, setSaving] = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);
    const [savingFollowup, setSavingFollowup] = useState(false);
    const [completingFollowup, setCompletingFollowup] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [followupMsg, setFollowupMsg] = useState('');

    const STATUSES = Object.keys(STATUS_CONFIG);
    const PRIORITIES = Object.keys(PRIORITY_CONFIG);
    const PRIVATE_NOTE_CHAR_LIMIT = 1000;
    const canSeePrivateNotes = Boolean(currentAdminUser?.username);

    useEffect(() => {
        setNotes(inquiry.notes || '');
        setFollowupDateInput(inquiry.followupDate || '');
        setShowAddPrivateNote(false);
        setNewPrivateNoteContent('');
        setEditingPrivateNoteId(null);
        setEditingPrivateNoteContent('');
        setPrivateNoteMsg('');
    }, [inquiry]);

    const loadPrivateNotes = useCallback(async () => {
        if (!canSeePrivateNotes) {
            setPrivateNotes([]);
            return;
        }
        setPrivateNotesLoading(true);
        setPrivateNotesError('');
        try {
            const data = await onLoadPrivateNotes(inquiry.id);
            setPrivateNotes(Array.isArray(data) ? data : []);
        } catch {
            setPrivateNotesError('Failed to load private notes.');
        } finally {
            setPrivateNotesLoading(false);
        }
    }, [canSeePrivateNotes, inquiry.id, onLoadPrivateNotes]);

    useEffect(() => {
        loadPrivateNotes();
    }, [loadPrivateNotes]);

    const handleSaveNotes = async () => {
        setSaving(true);
        setSaveMsg('');
        try {
            await onNoteSave(inquiry.id, notes);
            setSaveMsg('✅ Notes saved!');
        } catch {
            setSaveMsg('❌ Failed to save notes.');
        } finally {
            setSaving(false);
            setTimeout(() => setSaveMsg(''), 3000);
        }
    };

    const handleStatusChange = async (newStatus) => {
        setSavingStatus(true);
        await onStatusChange(inquiry.id, newStatus);
        setSavingStatus(false);
    };

    const handleFollowupSave = async () => {
        if (!followupDateInput) {
            setFollowupMsg('❌ Please select a follow-up date.');
            return;
        }

        setSavingFollowup(true);
        setFollowupMsg('');
        try {
            const isReschedule = Boolean(inquiry.followupDate) && !inquiry.followupCompletedAt;
            await onFollowupSave(inquiry.id, followupDateInput, isReschedule);
            setFollowupMsg(isReschedule ? '✅ Follow-up rescheduled.' : '✅ Follow-up date set.');
        } catch {
            setFollowupMsg('❌ Failed to save follow-up date.');
        } finally {
            setSavingFollowup(false);
            setTimeout(() => setFollowupMsg(''), 3000);
        }
    };

    const handleFollowupComplete = async () => {
        setCompletingFollowup(true);
        setFollowupMsg('');
        try {
            await onFollowupComplete(inquiry.id);
            setFollowupMsg('✅ Follow-up marked as completed.');
        } catch {
            setFollowupMsg('❌ Failed to mark follow-up as completed.');
        } finally {
            setCompletingFollowup(false);
            setTimeout(() => setFollowupMsg(''), 3000);
        }
    };

    const handleAddPrivateNote = async () => {
        const value = newPrivateNoteContent.trim();
        if (!value) {
            setPrivateNoteMsg('❌ Note content is required.');
            return;
        }
        if (value.length > PRIVATE_NOTE_CHAR_LIMIT) {
            setPrivateNoteMsg(`❌ Note cannot exceed ${PRIVATE_NOTE_CHAR_LIMIT} characters.`);
            return;
        }

        setSavingPrivateNote(true);
        setPrivateNoteMsg('');
        try {
            await onAddPrivateNote(inquiry.id, value);
            setNewPrivateNoteContent('');
            setShowAddPrivateNote(false);
            setPrivateNoteMsg('✅ Private note added.');
            await loadPrivateNotes();
        } catch {
            setPrivateNoteMsg('❌ Failed to add private note.');
        } finally {
            setSavingPrivateNote(false);
            setTimeout(() => setPrivateNoteMsg(''), 3000);
        }
    };

    const startEditPrivateNote = (note) => {
        setEditingPrivateNoteId(note.id);
        setEditingPrivateNoteContent(note.content || '');
        setPrivateNoteMsg('');
    };

    const cancelEditPrivateNote = () => {
        setEditingPrivateNoteId(null);
        setEditingPrivateNoteContent('');
    };

    const handleEditPrivateNote = async (noteId) => {
        const value = editingPrivateNoteContent.trim();
        if (!value) {
            setPrivateNoteMsg('❌ Note content is required.');
            return;
        }
        if (value.length > PRIVATE_NOTE_CHAR_LIMIT) {
            setPrivateNoteMsg(`❌ Note cannot exceed ${PRIVATE_NOTE_CHAR_LIMIT} characters.`);
            return;
        }

        setSavingEditPrivateNote(true);
        setPrivateNoteMsg('');
        try {
            await onUpdatePrivateNote(inquiry.id, noteId, value);
            setEditingPrivateNoteId(null);
            setEditingPrivateNoteContent('');
            setPrivateNoteMsg('✅ Private note updated.');
            await loadPrivateNotes();
        } catch {
            setPrivateNoteMsg('❌ Failed to update private note.');
        } finally {
            setSavingEditPrivateNote(false);
            setTimeout(() => setPrivateNoteMsg(''), 3000);
        }
    };

    const handleDeletePrivateNote = async (noteId) => {
        setDeletingPrivateNoteId(noteId);
        setPrivateNoteMsg('');
        try {
            await onDeletePrivateNote(inquiry.id, noteId);
            setPrivateNoteMsg('✅ Private note deleted.');
            if (editingPrivateNoteId === noteId) {
                cancelEditPrivateNote();
            }
            await loadPrivateNotes();
        } catch {
            setPrivateNoteMsg('❌ Failed to delete private note.');
        } finally {
            setDeletingPrivateNoteId(null);
            setTimeout(() => setPrivateNoteMsg(''), 3000);
        }
    };

    const fmt = (dt) => dt ? new Date(dt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
    const followupState = getFollowupState(inquiry);
    const canCompleteFollowup = Boolean(inquiry.followupDate) && !inquiry.followupCompletedAt;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div>
                        <p className="text-xs text-gray-400 font-mono">{inquiry.inquiryNumber}</p>
                        <h3 className="text-lg font-bold text-gray-900">{inquiry.customerName}</h3>
                        <p className="text-sm text-gray-500">{inquiry.company || 'No company'} · {inquiry.country || 'Unknown'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Status workflow */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                            {STATUSES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => handleStatusChange(s)}
                                    disabled={inquiry.status === s || savingStatus}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                                        ${inquiry.status === s
                                            ? STATUS_CONFIG[s].color + ' ring-2 ring-offset-1 ring-current'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                                        } disabled:opacity-50`}
                                >
                                    {STATUS_CONFIG[s].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contact info */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Details</p>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                            {[
                                { icon: Mail, label: inquiry.email },
                                { icon: Phone, label: inquiry.phone || '—' },
                                { icon: Building, label: inquiry.company || '—' },
                                { icon: Globe, label: inquiry.country || '—' },
                            ].map(({ icon: Icon, label }, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <Icon className="w-4 h-4 text-sml-green flex-shrink-0" />
                                    <span className="text-gray-700">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order details */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Inquiry Details</p>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <Package className="w-4 h-4 text-sml-green mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Products Requested</p>
                                    <p className="text-sm text-gray-800 font-medium">{inquiry.productsRequested || '—'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Tag className="w-4 h-4 text-sml-green mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Estimated Quantity</p>
                                    <p className="text-sm text-gray-800 font-medium">{inquiry.estimatedQuantity || '—'}</p>
                                </div>
                            </div>
                            {inquiry.specialRequirements && (
                                <div className="flex gap-2">
                                    <FileText className="w-4 h-4 text-sml-green mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Special Requirements</p>
                                        <p className="text-sm text-gray-700">{inquiry.specialRequirements}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Timeline</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span className="text-gray-400">Received</span>
                                <span className="font-medium">{fmt(inquiry.createdAt)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span className="text-gray-400">Responded</span>
                                <span className="font-medium">{fmt(inquiry.respondedAt)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span className="text-gray-400">Closed</span>
                                <span className="font-medium">{fmt(inquiry.closedAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" /> Follow-Up
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <FollowupBadge inquiry={inquiry} />
                                <span className="text-xs text-gray-500">
                                    Current Date: {inquiry.followupDate || '—'}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="date"
                                    value={followupDateInput}
                                    onChange={(event) => setFollowupDateInput(event.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none"
                                />
                                <button
                                    onClick={handleFollowupSave}
                                    disabled={savingFollowup}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-sml-green text-white hover:bg-sml-dark disabled:opacity-60"
                                >
                                    {savingFollowup ? <Loader2 className="w-3 h-3 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
                                    {inquiry.followupDate && !inquiry.followupCompletedAt ? 'Reschedule' : 'Set Date'}
                                </button>
                                <button
                                    onClick={handleFollowupComplete}
                                    disabled={!canCompleteFollowup || completingFollowup}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    {completingFollowup ? <Loader2 className="w-3 h-3 animate-spin" /> : <CalendarCheck className="w-3.5 h-3.5" />}
                                    Mark Completed
                                </button>
                            </div>

                            <p className={`text-xs font-semibold ${followupState.key === 'overdue' ? 'text-red-600' : 'text-gray-500'}`}>
                                {followupState.key === 'overdue'
                                    ? 'This follow-up is overdue and needs attention.'
                                    : followupState.key === 'today'
                                        ? 'This follow-up is due today.'
                                        : followupState.key === 'pending'
                                            ? 'Follow-up is scheduled and pending.'
                                            : followupState.key === 'completed'
                                                ? 'Follow-up has been completed.'
                                                : 'No follow-up date has been scheduled.'}
                            </p>

                            <span className={`text-xs ${followupMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                                {followupMsg}
                            </span>
                        </div>
                    </div>

                    {/* Internal Notes */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5" /> Internal Notes
                        </p>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add internal notes (only visible to your team)..."
                            rows={4}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none text-sm resize-none bg-gray-50"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${saveMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                                {saveMsg}
                            </span>
                            <button
                                onClick={handleSaveNotes}
                                disabled={saving}
                                className="bg-sml-green text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-sml-dark transition-colors disabled:opacity-60 flex items-center gap-1.5"
                            >
                                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                Save Notes
                            </button>
                        </div>
                    </div>

                    {canSeePrivateNotes && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <MessageSquare className="w-3.5 h-3.5" /> Private Conversation Notes
                                </p>
                                <button
                                    onClick={() => setShowAddPrivateNote((prev) => !prev)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sml-green text-white hover:bg-sml-dark"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Note
                                </button>
                            </div>

                            {showAddPrivateNote && (
                                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-3">
                                    <textarea
                                        value={newPrivateNoteContent}
                                        onChange={(event) => setNewPrivateNoteContent(event.target.value.slice(0, PRIVATE_NOTE_CHAR_LIMIT))}
                                        placeholder="Write private conversation details..."
                                        rows={4}
                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none text-sm resize-none bg-white"
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-500">
                                            {newPrivateNoteContent.length}/{PRIVATE_NOTE_CHAR_LIMIT}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setShowAddPrivateNote(false)}
                                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleAddPrivateNote}
                                                disabled={savingPrivateNote}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sml-green text-white hover:bg-sml-dark disabled:opacity-60"
                                            >
                                                {savingPrivateNote ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                                Save Note
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {privateNotesError && (
                                <div className="text-xs text-red-600 mb-2">{privateNotesError}</div>
                            )}

                            {privateNotesLoading ? (
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Loader2 className="w-4 h-4 animate-spin text-sml-green" /> Loading notes...
                                </div>
                            ) : privateNotes.length === 0 ? (
                                <div className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-xl p-3">
                                    No private notes yet.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {privateNotes.map((note) => {
                                        const isEditing = editingPrivateNoteId === note.id;
                                        const editCharCount = isEditing ? editingPrivateNoteContent.length : 0;
                                        return (
                                            <div key={note.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="text-xs text-gray-500">
                                                        <span className="font-bold text-gray-700">{note.authorUsername}</span> · {fmt(note.createdAt)}
                                                        {note.updatedAt ? ` · updated ${fmt(note.updatedAt)}` : ''}
                                                    </div>
                                                    {note.canEdit && !isEditing && (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => startEditPrivateNote(note)}
                                                                className="inline-flex items-center gap-1 text-xs font-semibold text-sml-green hover:text-sml-dark"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" /> Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePrivateNote(note.id)}
                                                                disabled={deletingPrivateNoteId === note.id}
                                                                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
                                                            >
                                                                {deletingPrivateNoteId === note.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {isEditing ? (
                                                    <div className="mt-2">
                                                        <textarea
                                                            value={editingPrivateNoteContent}
                                                            onChange={(event) => setEditingPrivateNoteContent(event.target.value.slice(0, PRIVATE_NOTE_CHAR_LIMIT))}
                                                            rows={3}
                                                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none text-sm resize-none bg-white"
                                                        />
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-xs text-gray-500">{editCharCount}/{PRIVATE_NOTE_CHAR_LIMIT}</span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={cancelEditPrivateNote}
                                                                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEditPrivateNote(note.id)}
                                                                    disabled={savingEditPrivateNote}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sml-green text-white hover:bg-sml-dark disabled:opacity-60"
                                                                >
                                                                    {savingEditPrivateNote ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <span className={`text-xs mt-2 block ${privateNoteMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                                {privateNoteMsg}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ══════════════════════ Main Page ══════════════════════
export function InquiriesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [currentAdminUser] = useState(() => {
        try {
            const stored = sessionStorage.getItem('adminUser');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const fetchInquiries = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (statusFilter && statusFilter !== 'ALL') params.set('status', statusFilter);
            if (search) params.set('search', search);
            const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to load');
            const json = await res.json();
            setInquiries(json.data || []);
        } catch (e) {
            setError('Could not load inquiries. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search]);

    useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/admin/inquiries/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Update failed');
            const json = await res.json();
            // Update inline in list and detail panel
            setInquiries(prev => prev.map(i => i.id === id ? json.data : i));
            setSelectedInquiry(prev => prev?.id === id ? json.data : prev);
        } catch (e) {
            alert('Failed to update status. Please try again.');
        }
    };

    const handleNoteSave = async (id, notes) => {
        const res = await fetch(`/api/admin/inquiries/${id}/notes`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes }),
        });
        if (!res.ok) throw new Error('Failed to save notes');
        const json = await res.json();
        setInquiries(prev => prev.map(i => i.id === id ? json.data : i));
        setSelectedInquiry(prev => prev?.id === id ? json.data : prev);
    };

    const handleFollowupSave = async (id, followupDate, isReschedule = false) => {
        const endpoint = isReschedule ? 'followup-reschedule' : 'followup-date';
        const res = await fetch(`/api/admin/inquiries/${id}/${endpoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followupDate }),
        });
        if (!res.ok) throw new Error('Failed to save follow-up date');
        const json = await res.json();
        setInquiries(prev => prev.map(i => i.id === id ? json.data : i));
        setSelectedInquiry(prev => prev?.id === id ? json.data : prev);
    };

    const handleFollowupComplete = async (id) => {
        const res = await fetch(`/api/admin/inquiries/${id}/followup-complete`, {
            method: 'PATCH',
        });
        if (!res.ok) throw new Error('Failed to complete follow-up');
        const json = await res.json();
        setInquiries(prev => prev.map(i => i.id === id ? json.data : i));
        setSelectedInquiry(prev => prev?.id === id ? json.data : prev);
    };

    const requireActorUsername = () => {
        const actor = currentAdminUser?.username;
        if (!actor) {
            throw new Error('Missing admin user session');
        }
        return actor;
    };

    const loadPrivateNotes = async (inquiryId) => {
        const actor = requireActorUsername();
        const res = await fetch(`/api/admin/inquiries/${inquiryId}/private-notes`, {
            headers: { 'X-Admin-User': actor },
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
            throw new Error(json.message || 'Failed to load private notes');
        }
        return json.data || [];
    };

    const addPrivateNote = async (inquiryId, content) => {
        const actor = requireActorUsername();
        const res = await fetch(`/api/admin/inquiries/${inquiryId}/private-notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-User': actor,
            },
            body: JSON.stringify({ content }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
            throw new Error(json.message || 'Failed to add private note');
        }
        return json.data;
    };

    const updatePrivateNote = async (inquiryId, noteId, content) => {
        const actor = requireActorUsername();
        const res = await fetch(`/api/admin/inquiries/${inquiryId}/private-notes/${noteId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-User': actor,
            },
            body: JSON.stringify({ content }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
            throw new Error(json.message || 'Failed to update private note');
        }
        return json.data;
    };

    const deletePrivateNote = async (inquiryId, noteId) => {
        const actor = requireActorUsername();
        const res = await fetch(`/api/admin/inquiries/${inquiryId}/private-notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'X-Admin-User': actor,
            },
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
            throw new Error(json.message || 'Failed to delete private note');
        }
    };

    const fmt = (dt) => dt ? new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    const filterCounts = {};
    ['ALL', ...Object.keys(STATUS_CONFIG)].forEach(s => {
        filterCounts[s] = s === 'ALL' ? inquiries.length : inquiries.filter(i => i.status === s).length;
    });

    const totalNew = inquiries.filter((i) => i.status === 'NEW').length;
    const totalQuoted = inquiries.filter((i) => i.status === 'QUOTED').length;
    const totalClosed = inquiries.filter((i) => i.status === 'CLOSED').length;
    const pendingFollowups = inquiries.filter((i) => {
        const state = getFollowupState(i);
        return state.key === 'pending' || state.key === 'today' || state.key === 'overdue';
    }).length;
    const overdueFollowups = inquiries.filter((i) => getFollowupState(i).key === 'overdue').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Inquiries</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{inquiries.length} total · real-time from database</p>
                </div>
                <button
                    onClick={fetchInquiries}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{inquiries.length}</p>
                </div>
                <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-blue-500">New</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">{totalNew}</p>
                </div>
                <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-purple-500">Quoted</p>
                    <p className="text-2xl font-bold text-purple-700 mt-1">{totalQuoted}</p>
                </div>
                <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-green-500">Closed</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{totalClosed}</p>
                </div>
                <div className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-amber-600">Pending Follow-Ups</p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">{pendingFollowups}</p>
                </div>
                <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-red-500">Overdue Follow-Ups</p>
                    <p className="text-2xl font-bold text-red-700 mt-1">{overdueFollowups}</p>
                </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by name, email, company, country, or inquiry number..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none"
                    />
                    {searchInput && (
                        <button type="button" onClick={() => { setSearchInput(''); setSearch(''); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <button type="submit"
                    className="bg-sml-green text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-sml-dark transition-colors">
                    Search
                </button>
            </form>

            {/* Status filter pills */}
            <div className="flex flex-wrap gap-2">
                {['ALL', ...Object.keys(STATUS_CONFIG)].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                            ${statusFilter === s
                                ? 'bg-sml-green text-white border-sml-green'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}
                    >
                        {s === 'ALL' ? 'All' : STATUS_CONFIG[s].label}
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin text-sml-green" />
                        <span>Loading inquiries...</span>
                    </div>
                ) : inquiries.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No inquiries found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or search term</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm admin-table">
                            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-3.5">Inquiry #</th>
                                    <th className="px-5 py-3.5">Customer</th>
                                    <th className="px-5 py-3.5 hidden md:table-cell">Products</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 hidden xl:table-cell">Follow-Up</th>
                                    <th className="px-5 py-3.5 hidden lg:table-cell">Priority</th>
                                    <th className="px-5 py-3.5 hidden lg:table-cell">Date</th>
                                    <th className="px-5 py-3.5">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {inquiries.map((inq) => {
                                    const followupState = getFollowupState(inq);
                                    const overdueRow = followupState.key === 'overdue';

                                    return (
                                    <tr
                                        key={inq.id}
                                        className={`transition-colors group ${overdueRow ? 'bg-red-50/40 hover:bg-red-50' : 'hover:bg-gray-50'}`}
                                    >
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                {inq.inquiryNumber}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-900">{inq.customerName}</div>
                                            <div className="text-xs text-gray-400">{inq.email}</div>
                                            <div className="text-xs text-gray-400">{inq.country}</div>
                                            {(followupState.key === 'pending' || followupState.key === 'today' || followupState.key === 'overdue') && (
                                                <div className={`mt-1 text-[11px] font-semibold ${followupState.key === 'overdue' ? 'text-red-600' : 'text-amber-600'}`}>
                                                    {followupState.key === 'overdue' ? 'Overdue follow-up' : 'Pending follow-up'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell max-w-[180px]">
                                            <p className="truncate text-gray-600 text-xs">{inq.productsRequested || '—'}</p>
                                            {inq.estimatedQuantity && (
                                                <p className="text-xs text-sml-green font-medium mt-0.5">{inq.estimatedQuantity}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={inq.status} />
                                        </td>
                                        <td className="px-5 py-4 hidden xl:table-cell">
                                            <div className="space-y-1">
                                                <FollowupBadge inquiry={inq} />
                                                <p className={`text-[11px] ${followupState.key === 'overdue' ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
                                                    {inq.followupDate || '—'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 hidden lg:table-cell">
                                            <PriorityBadge priority={inq.priority} />
                                        </td>
                                        <td className="px-5 py-4 hidden lg:table-cell text-xs text-gray-400">
                                            {fmt(inq.createdAt)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => setSelectedInquiry(inq)}
                                                className="text-sml-green hover:text-sml-dark text-xs font-bold uppercase tracking-wider hover:underline"
                                            >
                                                View →
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail panel */}
            {selectedInquiry && (
                <InquiryDetailPanel
                    inquiry={selectedInquiry}
                    onClose={() => setSelectedInquiry(null)}
                    onStatusChange={handleStatusUpdate}
                    onNoteSave={handleNoteSave}
                    onFollowupSave={handleFollowupSave}
                    onFollowupComplete={handleFollowupComplete}
                    currentAdminUser={currentAdminUser}
                    onLoadPrivateNotes={loadPrivateNotes}
                    onAddPrivateNote={addPrivateNote}
                    onUpdatePrivateNote={updatePrivateNote}
                    onDeletePrivateNote={deletePrivateNote}
                />
            )}
        </div>
    );
}
