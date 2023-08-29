const { Staff } = require("pikanetwork.js");

async function fetchStaffList() {
  try {
    const staff = new Staff();
    const list = await staff.getStaffList();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchStaffList();
