export const formatDate = (date: any) => {
  const pad = (n: any) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export const getCurrentTopicId = () => {
  const historyData = localStorage.getItem('historyData');
  if (historyData) {
    const dataList = JSON.parse(historyData);
    return dataList[0].id + 1;
  }
  return 1;
}