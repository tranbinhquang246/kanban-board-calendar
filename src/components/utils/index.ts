export  const getNumberOfDaysInCurrentMonth = ()  =>{
    // Tạo một đối tượng Date hiện tại
    const currentDate = new Date();
  
    // Lấy tháng hiện tại
    const currentMonth = currentDate.getMonth();
  
    // Đặt ngày trong tháng thành 0 để lấy ngày cuối cùng của tháng trước đó (tháng hiện tại)
    currentDate.setDate(0);
  
    // Lấy số ngày trong tháng hiện tại
    const numberOfDaysInCurrentMonth = currentDate.getDate();
  
    return numberOfDaysInCurrentMonth;
}
export const  createArrayOfObjects = (numDays : any)  => {
  const result = [];

  for (let i = 0; i < numDays; i++) {
    const newObj = {
      id: i,
      title: i,
    };
    result.push(newObj);
  }

  return result;
}