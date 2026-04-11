import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://fbvtddyxmzolbfmmkwxk.supabase.co', 'sb_publishable_BSAVjEp5Qff1Cc6aIYKCZg__VK7cxHE');

const DOCTORS = [
    // General
    { name: "Dr. Sanjay Gupta", exp: "15 Years", rating: 4.8, img: "SG", fee: "₹500", nextSlot: "Today, 10:00 AM", clinic: true, department: "general" },
    { name: "Dr. Anil Sharma", exp: "12 Years", rating: 4.7, img: "AS", fee: "₹400", nextSlot: "Tomorrow, 4:00 PM", clinic: false, department: "general" },
    { name: "Dr. Meera Patel", exp: "18 Years", rating: 4.9, img: "MP", fee: "₹600", nextSlot: "Today, 1:00 PM", clinic: true, department: "general" },
    { name: "Dr. Rajesh Iyer", exp: "22 Years", rating: 4.6, img: "RI", fee: "₹550", nextSlot: "Wed, 9:30 AM", clinic: true, department: "general" },
    { name: "Dr. Sneha Kapoor", exp: "8 Years", rating: 4.5, img: "SK", fee: "₹350", nextSlot: "Today, 6:00 PM", clinic: false, department: "general" },
    
    // Cardio
    { name: "Dr. Vivek Narang", exp: "25 Years", rating: 4.9, img: "VN", fee: "₹1500", nextSlot: "Tomorrow, 11:00 AM", clinic: true, department: "cardio" },
    { name: "Dr. Ritu Desai", exp: "20 Years", rating: 4.8, img: "RD", fee: "₹1200", nextSlot: "Today, 3:00 PM", clinic: false, department: "cardio" },
    { name: "Dr. Arvind Reddy", exp: "15 Years", rating: 4.7, img: "AR", fee: "₹1000", nextSlot: "Fri, 10:00 AM", clinic: true, department: "cardio" },
    { name: "Dr. Neha Verma", exp: "10 Years", rating: 4.6, img: "NV", fee: "₹800", nextSlot: "Today, 5:30 PM", clinic: true, department: "cardio" },
    { name: "Dr. K. N. Murthy", exp: "30 Years", rating: 4.9, img: "KM", fee: "₹2000", nextSlot: "Mon, 9:00 AM", clinic: false, department: "cardio" },
    
    // Neuro
    { name: "Dr. Vikram Singh", exp: "18 Years", rating: 4.6, img: "VS", fee: "₹1800", nextSlot: "Thu, 2:00 PM", clinic: true, department: "neuro" },
    { name: "Dr. Priti Joshi", exp: "12 Years", rating: 4.7, img: "PJ", fee: "₹1400", nextSlot: "Tomorrow, 12:30 PM", clinic: false, department: "neuro" },
    { name: "Dr. Suresh Menon", exp: "22 Years", rating: 4.8, img: "SM", fee: "₹1600", nextSlot: "Today, 4:00 PM", clinic: true, department: "neuro" },
    { name: "Dr. Harish Rao", exp: "28 Years", rating: 4.9, img: "HR", fee: "₹2000", nextSlot: "Wed, 11:00 AM", clinic: true, department: "neuro" },
    { name: "Dr. Ayesha Khan", exp: "15 Years", rating: 4.8, img: "AK", fee: "₹1500", nextSlot: "Fri, 3:30 PM", clinic: false, department: "neuro" },

    // Ortho
    { name: "Dr. Priya Desai", exp: "10 Years", rating: 4.8, img: "PD", fee: "₹900", nextSlot: "Tomorrow, 11:30 AM", clinic: true, department: "ortho" },
    { name: "Dr. Aman Gupta", exp: "14 Years", rating: 4.7, img: "AG", fee: "₹1000", nextSlot: "Today, 2:00 PM", clinic: true, department: "ortho" },
    { name: "Dr. Manish Sen", exp: "20 Years", rating: 4.9, img: "MS", fee: "₹1200", nextSlot: "Mon, 10:00 AM", clinic: false, department: "ortho" },
    { name: "Dr. Rohan Agarwal", exp: "18 Years", rating: 4.6, img: "RA", fee: "₹1100", nextSlot: "Today, 5:00 PM", clinic: true, department: "ortho" },
    { name: "Dr. Sunil Shetty", exp: "25 Years", rating: 4.9, img: "SS", fee: "₹1500", nextSlot: "Wed, 4:00 PM", clinic: true, department: "ortho" },

    // Pedia
    { name: "Dr. Aditi Sharma", exp: "12 Years", rating: 4.8, img: "AS", fee: "₹600", nextSlot: "Today, 9:00 AM", clinic: true, department: "pedia" },
    { name: "Dr. Rohan Das", exp: "8 Years", rating: 4.6, img: "RD", fee: "₹500", nextSlot: "Tomorrow, 3:30 PM", clinic: false, department: "pedia" },
    { name: "Dr. Swati Mishra", exp: "15 Years", rating: 4.9, img: "SM", fee: "₹800", nextSlot: "Today, 11:00 AM", clinic: true, department: "pedia" },
    { name: "Dr. Nitin Kumar", exp: "20 Years", rating: 4.7, img: "NK", fee: "₹1000", nextSlot: "Mon, 5:00 PM", clinic: true, department: "pedia" },
    { name: "Dr. Pooja Bajaj", exp: "10 Years", rating: 4.8, img: "PB", fee: "₹700", nextSlot: "Fri, 1:00 PM", clinic: false, department: "pedia" },

    // Opthalmo
    { name: "Dr. Lisa Ray", exp: "14 Years", rating: 4.7, img: "LR", fee: "₹800", nextSlot: "Fri, 10:15 AM", clinic: true, department: "opthalmo" },
    { name: "Dr. Karan Bhatia", exp: "18 Years", rating: 4.8, img: "KB", fee: "₹1000", nextSlot: "Today, 12:00 PM", clinic: true, department: "opthalmo" },
    { name: "Dr. Naveen Jindal", exp: "25 Years", rating: 4.9, img: "NJ", fee: "₹1500", nextSlot: "Tomorrow, 9:30 AM", clinic: false, department: "opthalmo" },
    { name: "Dr. Shilpa Sethi", exp: "12 Years", rating: 4.6, img: "SS", fee: "₹700", nextSlot: "Wed, 4:30 PM", clinic: true, department: "opthalmo" },
    { name: "Dr. Anil Kumble", exp: "20 Years", rating: 4.8, img: "AK", fee: "₹1200", nextSlot: "Today, 6:00 PM", clinic: true, department: "opthalmo" }
  ];

async function seed() {
    console.log("Emptying table (ignoring errors if no rows)");
    await supabase.from('doctors').delete().neq('exp', '0'); // Delete previous
    
    console.log("Inserting docs...");
    const { data, error } = await supabase.from('doctors').insert(DOCTORS);
    if (error) {
        console.error("ERROR INSERTING DATA:", error);
        if (error.code === '42P01') {
           console.log("\nIt seems the 'doctors' table does NOT exist in Supabase yet.");
        }
    } else {
        console.log("SUCCESSFULLY INSERTED DOCTORS");
    }
}
seed();
