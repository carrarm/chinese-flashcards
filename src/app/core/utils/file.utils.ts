export const downloadFile = (filename: string, fileContent: string) => {
  const downloadLink = document.createElement("a");
  downloadLink.setAttribute(
    "href",
    encodeURI("data:application/json;charset=utf-8," + fileContent)
  );
  downloadLink.setAttribute("download", filename);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
