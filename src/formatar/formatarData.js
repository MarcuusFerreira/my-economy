
export const formatarData = (text) => {
    let formatted = text.replace(/[^0-9]/g, '');
  
    if (formatted.length > 2 && formatted.length <= 4)
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
    if (formatted.length > 4)
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}/${formatted.slice(4, 8)}`;
  
    return formatted;
  };
  