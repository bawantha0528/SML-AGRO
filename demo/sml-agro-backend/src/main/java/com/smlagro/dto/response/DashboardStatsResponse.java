package com.smlagro.dto.response;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    private long totalInquiries;
    private long newToday;
    private long newThisWeek;
    private long openInquiries;
    private long closedInquiries;
    private double conversionRate;
    private double avgResponseHours;
    private double totalInquiriesChangePct;
    private double newTodayChangePct;
    private double conversionRateChangePct;
    private double avgResponseHoursChangePct;
    private List<Map<String, Object>> weeklyTrend;
    private List<Map<String, Object>> countryBreakdown;
    private List<Map<String, Object>> statusBreakdown;

    public DashboardStatsResponse() {
    }

    public long getTotalInquiries() {
        return totalInquiries;
    }

    public void setTotalInquiries(long totalInquiries) {
        this.totalInquiries = totalInquiries;
    }

    public long getNewToday() {
        return newToday;
    }

    public void setNewToday(long newToday) {
        this.newToday = newToday;
    }

    public long getNewThisWeek() {
        return newThisWeek;
    }

    public void setNewThisWeek(long newThisWeek) {
        this.newThisWeek = newThisWeek;
    }

    public long getOpenInquiries() {
        return openInquiries;
    }

    public void setOpenInquiries(long openInquiries) {
        this.openInquiries = openInquiries;
    }

    public long getClosedInquiries() {
        return closedInquiries;
    }

    public void setClosedInquiries(long closedInquiries) {
        this.closedInquiries = closedInquiries;
    }

    public double getConversionRate() {
        return conversionRate;
    }

    public void setConversionRate(double conversionRate) {
        this.conversionRate = conversionRate;
    }

    public double getAvgResponseHours() {
        return avgResponseHours;
    }

    public void setAvgResponseHours(double avgResponseHours) {
        this.avgResponseHours = avgResponseHours;
    }

    public double getTotalInquiriesChangePct() {
        return totalInquiriesChangePct;
    }

    public void setTotalInquiriesChangePct(double totalInquiriesChangePct) {
        this.totalInquiriesChangePct = totalInquiriesChangePct;
    }

    public double getNewTodayChangePct() {
        return newTodayChangePct;
    }

    public void setNewTodayChangePct(double newTodayChangePct) {
        this.newTodayChangePct = newTodayChangePct;
    }

    public double getConversionRateChangePct() {
        return conversionRateChangePct;
    }

    public void setConversionRateChangePct(double conversionRateChangePct) {
        this.conversionRateChangePct = conversionRateChangePct;
    }

    public double getAvgResponseHoursChangePct() {
        return avgResponseHoursChangePct;
    }

    public void setAvgResponseHoursChangePct(double avgResponseHoursChangePct) {
        this.avgResponseHoursChangePct = avgResponseHoursChangePct;
    }

    public List<Map<String, Object>> getWeeklyTrend() {
        return weeklyTrend;
    }

    public void setWeeklyTrend(List<Map<String, Object>> weeklyTrend) {
        this.weeklyTrend = weeklyTrend;
    }

    public List<Map<String, Object>> getCountryBreakdown() {
        return countryBreakdown;
    }

    public void setCountryBreakdown(List<Map<String, Object>> countryBreakdown) {
        this.countryBreakdown = countryBreakdown;
    }

    public List<Map<String, Object>> getStatusBreakdown() {
        return statusBreakdown;
    }

    public void setStatusBreakdown(List<Map<String, Object>> statusBreakdown) {
        this.statusBreakdown = statusBreakdown;
    }
}
