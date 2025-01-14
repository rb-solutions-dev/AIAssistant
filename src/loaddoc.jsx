import React, { useEffect, useState } from "react";

    

const Final = () => {
  const [documentss, setDocumentss] = useState("");
  
  useEffect(() => {
    const fetchDocument = async () => {

      
      try {
        const response = await fetch("/articulosff.txt"); // Path relative to public folder
        const text = await response.text();
        setDocumentss(text);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocument();

    const convertedDocumentss = documentss;  

    alert(convertedDocumentss)

  }, []);

return(

<div>
 {documentss}
</div>

)
};

export default Final;