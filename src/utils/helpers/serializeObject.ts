export const serializeObject = (obj: any, prefix?: string): string => {
    const parts: string[] = [];
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const propName = prefix ? `${prefix}[${key}]` : key;
  
        if (Array.isArray(value)) {
          value.forEach((val, index) => {
            const indexedPropName = `${propName}[${index}]`;
            parts.push(`${indexedPropName}=${encodeURIComponent(val)}`);
          });
        } else if (value !== null && typeof value === "object") {
          parts.push(serializeObject(value, propName));
        } else {
          parts.push(`${propName}=${encodeURIComponent(value)}`);
        }
      }
    }
  
    return parts.join("&");
  };
  
  