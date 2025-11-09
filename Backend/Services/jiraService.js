export const getUserStories = async (projectId) => {
  return [
    {
      id: "10001",
      key: "PROJ-101",
      summary: "As a PM, I want automated project health reports.",
      status: "In Progress",
      assignee: "Alice Johnson"
    },
    {
      id: "10002",
      key: "PROJ-102",
      summary: "As a developer, I want risk alerts for delayed stories.",
      status: "Open",
      assignee: "Bob Smith"
    }
  ];
};
