/* eslint-disable react-hooks/rules-of-hooks */
import  { useState } from 'react'
import useShowToast from './useShowToast';

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();
  const handleImageChange = e => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")){
      const reader = new FileReader();
      console.log('➡️➡️➡️', reader)
      reader.onloadend = () => {
        setImgUrl(reader.result);
      }

      reader.readAsDataURL(file)
    }else{
      showToast("error", "Please select an image file" ,"error")
      setImgUrl(null)
    }
    // console.log(imgUrl)
  }
  return {handleImageChange, imgUrl, setImgUrl};
}

export default usePreviewImg