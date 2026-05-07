# Hosting Guide: BITS Hackathon Hub (Free Tier Edition)

To host this project completely for free, you'll need three parts: a Database, a Backend server, and a Frontend host.

## 1. 🛢️ Database: Aiven (Free MySQL)
Railway is paid, but **Aiven.io** offers a "Free Plan" for MySQL.
1. Sign up at [aiven.io](https://aiven.io).
2. Create a new **MySQL** service.
3. Choose the **"Free Plan"** (usually available in AWS/GCP regions).
4. Once created, copy the **Service URI** or the individual Host, Port, User, and Password.
5. In your Aiven dashboard, find the "CA Certificate" and download it if needed, or simply enable "Allow all IP addresses" (0.0.0.0/0) in the Firewall settings for ease of development.

## 2. ⚙️ Backend: Render.com (Free Spring Boot)
Render allows you to host Spring Boot apps for free.
1. Push your code to a **GitHub** repository.
2. Sign up at [render.com](https://render.com).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repo.
5. **Settings**:
   - Runtime: `Docker` (Render handles Spring Boot best via Docker) or `Java`.
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/*.jar`
6. **Environment Variables** (Add these in the Render dashboard):
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<YOUR_AIVEN_HOST>:<PORT>/defaultdb?useSSL=true`
   - `SPRING_DATASOURCE_USERNAME`: `avnadmin` (default for Aiven)
   - `SPRING_DATASOURCE_PASSWORD`: `<YOUR_AIVEN_PASSWORD>`
   - `JWT_SECRET`: `a-very-long-random-string-for-security-bits-hackathon`
   - `SPRING_SQL_INIT_MODE`: `always` (This runs your `schema.sql` on first start)

*Note: Free tier "spins down" after 15 mins of inactivity. The first request might take 30 seconds to wake up.*

## 3. 🎨 Frontend: Vercel (Free React)
Vercel is the best for React apps.
1. Push your code to GitHub (same repo).
2. Connect your repo to **Vercel**.
3. **Environment Variable**:
   - `VITE_API_URL`: `https://your-backend-name.onrender.com/api`
4. Deploy!

---

## 💡 How it all connects
The connection works in a chain:
1. **The User** opens your website on **Vercel**.
2. **The Website (React)** sends an API request to **Render** (your Spring Boot backend).
3. **The Backend (Spring Boot)** connects to **Aiven** (MySQL) to fetch/save data.
4. **MySQL** sends the data back to the Backend.
5. **The Backend** sends a JSON response back to the Website.

**Security Warning:** Never put your MySQL password in the React code. Only the Backend should know the database password.
