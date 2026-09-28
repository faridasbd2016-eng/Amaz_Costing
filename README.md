# AMAZ Product Costing

**Amin Square (BD) Ltd. / Gift Touch** এর জন্য একটি single-file পণ্য **costing ও দরপত্র (Price Quotation)** সফটওয়্যার। China → Bangladesh import পণ্যের পূর্ণ costing, budget/projection ও professional দরপত্র তৈরি করা যায় — কোনো server বা internet database লাগে না।

🔗 **Live app:** GitHub Pages চালু করার পর এখানে লিংক বসবে → `https://<your-username>.github.io/<repo-name>/`

---

## এটা কী করে

- **Costing:** RM, PM, Labor, Power, Machine/Utility, Factory Overhead, Head Office O/H — সব ধরে per-carton খরচ ও দাম
- **কয়েক ধরনের costing:** Export · Local · Ghorer · Depot · Demo
- **Overhead দুই পদ্ধতি:** Amount/Month অথবা % of Prime Cost (RM+PM+Labor)
- **FG Product Master · Order Requisition · Machine/Utility** (inline-editable, keyboard nav)
- **দরপত্র (Quotation):** foreign-buyer proposal format, ৩ ধরনের Letter Head Print (Without / Default Letter Head / Letter Head Paper), Excel export
- **Excel export:** costing sheet ও দরপত্র — সূত্রসহ
- **সব data আপনার browser-এ** (localStorage) — নিরাপদ, offline-eও চলে

## কীভাবে চালাবেন

- **সরাসরি:** `index.html` যেকোনো ব্রাউজারে (Chrome সবচেয়ে ভালো) খুলুন
- **Online:** নিচের GitHub Pages লিংকে খুলুন — মোবাইল/যেকোনো ডিভাইস থেকে

## Login

- User: `admin` · Pass: `admin123` (অ্যাপের ভেতরে বদলানো যায়)
- ℹ️ এই login শুধু client-side সুবিধার জন্য — এটা আসল security নয়।

## সাহায্য / Changelog

অ্যাপের ভেতরে **F1** চাপুন — পূর্ণ User Guide ও প্রতিটা version-এর পরিবর্তন (Changelog) আছে।
**বর্তমান version: v18.31**

## Tech

- Single-file HTML + vanilla JavaScript
- localStorage database (কোনো backend নেই)
- Excel export: SheetJS · ExcelJS · xlsx-js-style (CDN থেকে লোড হয়)

---

© Amin Square (BD) Ltd. — সর্বস্বত্ব সংরক্ষিত। Built by Farid Ahmad Rayhan.
