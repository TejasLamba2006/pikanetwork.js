const { Staff } = require("../src/index.js");

async function fetchStaffList() {
  try {
    const staff = new Staff();
    const list = await staff.getStaffList();
    console.log(list);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchStaffList();
