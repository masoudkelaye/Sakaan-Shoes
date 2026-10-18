# Sakaan Shoes Website | موقع أحذية سكعان

Modern bilingual (English + Arabic) website with a **visual Admin Panel**.

You can add, edit, and delete photos and all details **directly on the website** without touching any code.

---

## 🎯 What you can manage from the Admin Panel

- Upload / change / delete shoe photos
- Edit product names and descriptions (English + Arabic)
- Change categories (Men / Women / Kids)
- Change the website logo
- Change the factory / brand name
- Update WhatsApp number
- Update Facebook & Instagram links
- Change default language

All from a modern visual interface.

---

## 🚀 How to publish the website (Recommended: Netlify)

### Step 1 – Create a free GitHub repository
1. Go to [github.com](https://github.com) and create a new repository (example name: `sakaan-shoes`)
2. Upload all the files from this folder to the repository

### Step 2 – Deploy on Netlify
1. Go to [netlify.com](https://www.netlify.com) and sign up (free)
2. Click **"Add new site" → "Import an existing project"**
3. Connect your GitHub account and select the `sakaan-shoes` repository
4. Click **Deploy** (leave all settings as default)

You will get a free website address like:  
`https://sakaan-shoes.netlify.app`

### Step 3 – Enable the Admin Panel (very important)
1. In Netlify dashboard → go to **Site configuration → Identity**
2. Click **Enable Identity**
3. Go to **Services → Git Gateway** and click **Enable Git Gateway**
4. Go to **Identity → Registration** and set it to **Invite only**
5. Invite yourself: **Identity → Invite users** → enter your email

### Step 4 – Login to Admin
Open your website and go to:  
`https://your-site.netlify.app/admin`

Login with the email you invited.  
Now you can manage everything visually!

---

## 📱 Using the Admin Panel

After logging in to `/admin` you will see two main sections:

### 1. Site Settings | إعدادات الموقع
- Change logo
- Change site name (English & Arabic)
- Change WhatsApp number
- Change Facebook & Instagram links

### 2. Products / Shoes | المنتجات
- Click **"Add product"** to add a new shoe
- Upload a photo
- Fill English and Arabic titles & descriptions
- Choose category
- Save → the website updates automatically

You can also edit or delete any existing product.

---

## 💻 Testing the Admin Panel on your computer (optional)

If you want to test the admin before publishing:

1. Install Node.js from https://nodejs.org
2. Open a terminal in the website folder
3. Open **two** terminals in the website folder and run:
   ```bash
   npx decap-server      # terminal 1: local CMS backend (port 8081)
   npx serve .           # terminal 2: serves the website
   ```
4. Open `http://localhost:3000/admin/` (use the port `serve` prints)

---

## 📁 Folder Structure

```
sakaan-shoes/
├── index.html              ← Main website
├── admin/                  ← Admin panel
│   ├── index.html
│   └── config.yml
├── data/
│   ├── settings.json       ← Logo, WhatsApp, social links...
│   ├── products.json       ← All shoes data
│   └── images/uploads/     ← Photos you upload from admin go here
├── css/
├── js/
└── README.md
```

---

## Need help?

Once the website is live on Netlify, just open `/admin`, log in, and start managing your products visually.

If you want me to help you deploy it or set up the Netlify Identity, just tell me!
