export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};


export const addThousandsSeparator = (num) => {
  if (num === null || isNaN(num)) {
    
    const [integralPart, fractionalPart] = num.toString().split(".");
    const formattedInteger = integralPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart
      ? `${formattedInteger}.${fractionalPart}`
      : formattedInteger;
  }
   
};