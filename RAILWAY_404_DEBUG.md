# Railway Backend 404 Debugging Guide

## Issue: Frontend getting 404 and "SyntaxError: Unexpected token 'T'"

This means:
- ✅ Frontend successfully connected to Railway backend
- ❌ Backend returned HTML error page (starting with "T") instead of JSON
- ❌ This usually indicates database connection failed during startup

---

## Step 1: Test if Backend is Running

### Test Health Check Endpoint
Open in browser:
```
https://sml-agro-backend-production.up.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "UP",
  "message": "SML Agro Backend is running",
  "timestamp": 1625097600000,
  "service": "sml-agro-backend"
}
```

If you see:
- ✅ JSON response → Backend is running, proceed to Step 2
- ❌ 404 HTML page → Backend not starting, check logs in Railway dashboard
- ❌ Timeout → Backend crashed or not deployed properly

---

## Step 2: Test Database Connection

### Test DB Health Endpoint
```
https://sml-agro-backend-production.up.railway.app/api/health/db
```

**Expected Response:**
```json
{
  "database": "connected",
  "status": "UP"
}
```

**If database is disconnected:**
1. Go to Railway Dashboard → Backend Service → Deployments
2. Check the logs for connection errors
3. Verify MySQL credentials:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`

---

## Step 3: Test Product Endpoint

### Test the Products API
```
https://sml-agro-backend-production.up.railway.app/api/public/products
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "price": 100.00,
    ...
  }
]
```

---

## Common Issues & Solutions

### Issue 1: Database Not Connecting
**Error:** Connection refused, timeout, or "MySQL is not running"

**Solutions:**
1. Check Railway MySQL service is active
2. Verify connection string in `SPRING_DATASOURCE_URL`
3. Check network connectivity between services
4. Review logs: `Railway Dashboard → Backend → Deployments → Logs`

### Issue 2: Controller Not Found
**Error:** 404 on `/api/public/products`

**Check:**
- ✅ `@RequestMapping("/api/public/products")` exists in `PublicProductController.java`
- ✅ No `@CrossOrigin` conflicts (we removed these)
- ✅ Spring Security allows `/api/public/**` (✅ configured in `WebConfig.java`)

### Issue 3: CORS Issues
**Error:** CORS error in browser console (not 404)

**Check:**
- ✅ `CorsConfig.java` allows Vercel domain
- ✅ Backend CORS headers being sent
- Test with curl:
  ```bash
  curl -H "Origin: https://sml-agro-production.vercel.app" \
       https://sml-agro-backend-production.up.railway.app/api/health
  ```

### Issue 4: Application Not Deploying
**Error:** Backend service shows "Failed" in Railway

**Check:**
1. Build logs: `Railway Dashboard → Backend → Deployments → Build Logs`
2. Common failures:
   - Missing Maven dependencies
   - Java version mismatch
   - Environment variables not set
3. Rebuild: `Railway Dashboard → Backend → Deploy → Redeploy`

---

## Quick Checklist

- [ ] Health endpoint returns 200 OK
- [ ] Health endpoint shows database: "connected"
- [ ] Products endpoint returns JSON array
- [ ] No 404 errors
- [ ] No CORS errors in browser console
- [ ] Frontend `.env` has correct `VITE_API_URL`
- [ ] Railway backend service shows "Deployed" (not "Failed")
- [ ] All environment variables set in Railway dashboard

---

## Testing Endpoints Locally

### Before Deploying to Railway

Test locally with:
```bash
curl http://localhost:8080/api/health
curl http://localhost:8080/api/public/products
```

---

## Contact Points if Issues Persist

1. **Build Issues:** Check `Maven` build output in Railway logs
2. **Database Issues:** Check MySQL connection in Railway logs
3. **CORS Issues:** Check browser network tab → Headers
4. **Other Issues:** Check Spring Boot logs for stack traces

