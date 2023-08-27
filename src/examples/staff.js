const { Staff } = require("../src/index.js");

async function fetchStaffList() {
  try {
    const staff = new Staff();
    const list = await staff.getStaffList();
    console.log(`Staff List: \n${list}`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchStaffList();
