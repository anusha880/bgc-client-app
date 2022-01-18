export const initialValue = [
  {
    name: "Select first security question",
    id: "1",
    answerOptions: [
      { name: "None", value: "0" },
      { name: "What is your favorite BGC workshop?", Value: "1" },
      { name: "what is your favorite programming language?", Value: "2" },
      { name: "What is your favorite role model?", Value: "3" },
      { name: "What is your favorite subject?", Value: "4" },
      { name: "What is your favorite food?", Value: "5" },
      { name: "What is your dream job/career?", Value: "6" },
      { name: "What is your favorite sport?", Value: "7" },
      { name: "What is your favorite color?", Value: "8" },
      { name: "What is your favorite music genre?", Value: "9" },
      { name: "What high school did you attend?", Value: "10" },
    ],
  },
  {
    name: "Select second security question",
    id: "2",
    answerOptions: [
      { name: "None", value: "0" },
      { name: "What is your favorite BGC workshop?", Value: "1" },
      { name: "what is your favorite programming language?", Value: "2" },
      { name: "What is your favorite role model?", Value: "3" },
      { name: "What is your favorite subject?", Value: "4" },
      { name: "What is your favorite food?", Value: "5" },
      { name: "What is your dream job/career?", Value: "6" },
      { name: "What is your favorite sport?", Value: "7" },
      { name: "What is your favorite color?", Value: "8" },
      { name: "What is your favorite music genre?", Value: "9" },
      { name: "What high school did you attend?", Value: "10" },
    ],
  },
  {
    name: "Select third security question",
    id: "3",
    answerOptions: [
      { name: "None", value: "0" },
      { name: "What is your favorite BGC workshop?", Value: "1" },
      { name: "what is your favorite programming language?", Value: "2" },
      { name: "What is your favorite role model?", Value: "3" },
      { name: "What is your favorite subject?", Value: "4" },
      { name: "What is your favorite food?", Value: "5" },
      { name: "What is your dream job/career?", Value: "6" },
      { name: "What is your favorite sport?", Value: "7" },
      { name: "What is your favorite color?", Value: "8" },
      { name: "What is your favorite music genre?", Value: "9" },
      { name: "What high school did you attend?", Value: "10" },
    ],
  },
];

export const profileQuestionsInit = [
  {
    type: "college",
    values: [
      "What College/University do you attend ?",
      "What are you studying ?",
    ],
  },
  {
    type: "workforce",
    values: [
      "Where do you work ?",
      "What department do you work in ?",
      "What is your job titile ?",
    ],
  },
  {
    type: "timeoff",
    values: ["Why are you taking some time off ?"],
  },
  ,
  {
    type: "figureout",
    values: ["What exactly are you trying to figure out ?"],
  },
];
export const months = [
  { name: "January", value: "january" },
  { name: "February", value: "february" },
  { name: "March", value: "march" },
  { name: "April", value: "april" },
  { name: "May", value: "may" },
  { name: "June", value: "june" },
  { name: "July", value: "july" },
  { name: "August", value: "august" },
  { name: "September", value: "september" },
  { name: "October", value: "october" },
  { name: "November", value: "november" },
  { name: "December", value: "december" },
];
export const years = [
  { name: "2021", value: "2021" },
  { name: "2020", value: "2020" },
  { name: "2019", value: "2019" },
  { name: "2018", value: "2018" },
];

export const experience = [
  { name: "Company", value: "updatedCompany" },
  { name: "Department", value: "updatedDepartment" },
  { name: "Job Title", value: "updatedJobTtile" },
  { name: "Location", value: "updatedLocation" },
];
export const educations = [
  { name: "University", value: "updatedUniversity" },
  { name: "Field Of Study", value: "updatedFieldOfStudy" },
  { name: "Location", value: "updatedLocation" },
];
export const initialChipData = [
  { key: 0, label: "Artificial Intelligence", itemSelected: false },
  { key: 1, label: "Blockchain", itemSelected: false },
  { key: 2, label: "Gaming", itemSelected: false },
  { key: 3, label: "Mobile and App design", itemSelected: false },
  { key: 4, label: "Robotics", itemSelected: false },
  { key: 5, label: "HTML/CSS", itemSelected: false },
  { key: 6, label: "UX/UI", itemSelected: false },
  { key: 7, label: "VR/AR", itemSelected: false },
  { key: 8, label: "React JS", itemSelected: false },
  { key: 9, label: "Node JS", itemSelected: false },
  { key: 10, label: "Java", itemSelected: false },
];
export const getRoutes = (authenticated, value, history) => {
  if (authenticated) {
    switch (value) {
      case 0:
      case 1:
        // Needs to change later
        history.push("/communityHome");
        break;
      case 2:
        history.push("/communityHome");
        break;
      default:
        history.push("/login");
        // logoutUser();
        break;
    }
  }
  if (!authenticated) {
    switch (value) {
      case 0:
        history.push("/login");
      case 1:
        history.push("/signup");
      default:
        history.push("/login");
    }
  }
};
export const eventsData = [
  { name: "Workshop", value: "1" },
  { name: "Summer Camp", value: "2" },
  { name: "Enrichment", value: "3" },
  { name: "Ambassador/Alumnae Program", value: "4" },
  { name: "Code club", value: "5" },
  { name: "Hackathon", value: "6" },
  { name: "Special Project", value: "7" },
  { name: "Speaking Engagement", value: "8" },
  { name: "BGC Tabling", value: "9" },
  { name: "Volunteer", value: "10" },
];

export const chapterValue = [
  { name: "Atlanta", value: "1" },
  { name: "BayArea", value: "2" },
  { name: "Boston", value: "3" },
  { name: "Chicago", value: "4" },
  { name: "Dallas", value: "5" },
  { name: "Detroit", value: "6" },
  { name: "Houston", value: "7" },
  { name: "Los Angeles", value: "8" },
  { name: "Memphis", value: "9" },
  { name: "Miami", value: "10" },
  { name: "New York", value: "11" },
  { name: "Raleigh-Durham", value: "12" },
  { name: "Seattle", value: "13" },
  { name: "South Africa", value: "14" },
  { name: "Washington D.C", value: "15" },
  { name: "Other", value: "16" },
];

export const statuss = [
  { name: "Employed", value: "Employed" },
  { name: "Unemployed", value: "Unemployed" },
];

// regex to capture links
export const linkRegex = /((https?:\/\/)?[^\s.]+\.[\w][^\s]+)/g;

export const getStatus = (status) => {
  const mapping = {
    active: "Active",
    inactive: "Disabled",
    pending: "Pending Approval",
  };

  return mapping[status] || "";
};

export const getCommunityStatus = (status) => {
  const mapping = {
    active: "Active",
    inactive: "Closed",
  };

  return mapping[status] || "";
};

export const getStatusColor = (status) => {
  const mapping = {
    active: "#008767",
    inactive: "#B42C01",
    pending: "#EA700B",
  };

  return mapping[status] || "auto";
};
