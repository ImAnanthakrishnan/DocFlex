import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import uploadImageCloudinary from "../../utilis/uploadCloudinary";
import addImage from "../../assets/images/add-2935429_640.webp";
import axios from "axios";
import { BASE_URL } from "../../config";
import {  useAppSelector } from "../../app/hooks";

import { toast } from "react-toastify";
//import { useNavigate } from "react-router-dom";
 type Prescription = {
  symptoms: string;
  disease: string;
  medicines: {
    name: string;
    quantity: number;
    time_gap: string;
  }[];
  testReport: {
    img: string;
  }[];
};

type PropsType = {
  userId:string;
  action?:string;
  datas?:any
}


const AddPrescription = ({userId,action,datas}:PropsType) => {
  //const navigate = useNavigate();
 // const [selectedFile, setSelectedFile] = useState<ImageType>([{img:""}]);
  const [formData, setFormData] = useState<Prescription>({
    symptoms: datas?.symptoms || "",
    disease: datas?.disease || "",
    medicines: datas?.medicines?.map((med:any)=>({
      name:med.name,
      quantity:med.quantity,
      time_gap:med.time_gap
    }))||[{name:"",quantity:"",time_gap:""}],
    testReport: datas?.testReports?.map((item:any)=>({
      img:item.img
    })) || [{img:""}]
  });


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addItem = (key: keyof Prescription, item: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: [...(prevFormData[key] as any[]), item],
    }));
  };

  const handleReusableInputChangeFnc = (
    key: keyof Prescription,
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => {
      const updatedItems = [...(prevFormData[key] as any[])];

      updatedItems[index][name] = value;

      return {
        ...prevFormData,
        [key]: updatedItems,
      };
    });
  };

  const deleteItem = (key: keyof Prescription, index: number) => {
    setFormData((prevFormData) => {
      if (!prevFormData || !(key in prevFormData)) {
        return prevFormData;
      }

      const dataArray = prevFormData[key];
      if (!Array.isArray(dataArray)) {
        return prevFormData;
      }

      const updatedArray = dataArray.filter((_, i) => i !== index);

      return {
        ...prevFormData,
        [key]: updatedArray,
      };
    });
  };

  const addMedicine = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    addItem("medicines", {
      name: "",
      quantity: "",
      time_gap: "",
    });
  };

  const handleMedicineChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    handleReusableInputChangeFnc("medicines", index, event);
  };

  const deleteMedicine = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    deleteItem("medicines", index);
  };

  const addImg = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    addItem("testReport", {
      img: "",
    });
  };

  const handleTestReportChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
   
    if (file) {
      // Simulating image upload using Cloudinary
      const data = await uploadImageCloudinary(file);

      setFormData((prevFormData) => {
        const updatedItems = [...prevFormData.testReport];
        if(updatedItems[index]){
          updatedItems[index]["img"] = data?.url; // Assuming 'img' is the key for the image URL
        }else{
          updatedItems[index] = {img:data?.url};
        }
     

        return {
          ...prevFormData,
          testReport: updatedItems,
        };
      });
    }
  };

  const deleteTestReports = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    deleteItem("testReport", index);
  };

  const {token} = useAppSelector(data => data.doctor);

  const authToken = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }


 // const dispatch = useAppDispatch()

 const addMedicalRecords = async(e:React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
 // dispatch(fetchPrescriptionStart());

    await axios.post(`${BASE_URL}/prescription/${userId}`,{formData},authToken)
    .then((res)=>{
      const {message} = res.data;
     // dispatch(fetchPrescriptionSuccess(data));
      toast.success(message);
     
    })
    .catch((err)=>{
    //  dispatch(fetchPrescriptionFailed(err.response.message));
      toast.error(err.response.message);
    })
  }

  const editMedicalRecords = async(e:React.FormEvent<HTMLFormElement>) => {

      e.preventDefault();

      await axios.patch(`${BASE_URL}/prescription/${datas?._id}`,{formData},authToken)
      .then((res) => {
        const {message} = res.data;
        toast.success(message);
      })
      .catch((err) => {
        toast.error(err.response.message)
      })

  }

  return (
    <div>
      <form action="" onSubmit={action ? editMedicalRecords : addMedicalRecords}>
        <div className="mb-5">
          <p className="from__label">Symptoms</p>
          <input
            type="text"
            name="symptoms"
              value={formData.symptoms}
            onChange={handleInputChange}
            placeholder="symptoms"
            className="form__input"
          />
          {/*errors.name && <p className="text-red-300">{errors.name}</p>*/}
        </div>
        <div className="mb-5">
          <p className="from__label">Disease</p>
          <input
            type="text"
            name="disease"
              value={formData.disease}
            onChange={handleInputChange}
            placeholder="disease"
            className="form__input"
          />
          {/*errors.email && (
            <p className="text-red-300">{errors.email}</p>
          )*/}
        </div>
        <div className="mb-5">
          <p className="form__label">Medicines</p>
          {formData.medicines?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="form__label">Name</p>
                    <input
                      type="text"
                      //{...register(`qualification.${index}.startingDate`)}
                      name="name"
                      value={item.name}
                      className="form__input"
                      onChange={(e) => handleMedicineChange(e, index)}
                    />
                    {/*errors?.qualification?.[index]?.startingDate && (
                      <p className="text-red-300">
                        {errors?.qualification?.[index]?.startingDate}
                      </p>
                    )*/}
                  </div>
                  <div>
                    <p className="form__label">Quantity</p>
                    <input
                      type="number"
                      // {...register(`qualification.${index}.endingDate`)}
                      name="quantity"
                      value={item.quantity}
                      className="form__input"
                      onChange={(e) => handleMedicineChange(e, index)}
                    />
                    {/*errors?.qualification?.[index]?.endingDate && (
                      <p className="text-red-300">
                        {errors?.qualification?.[index]?.endingDate}
                      </p>
                    )*/}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mt-5">
                  <div>
                    <p className="form__label">Day*</p>
                    <select
                      name="time_gap"
                      value={item.time_gap}
                      className="form__input py-3.5"
                      onChange={(e) => handleMedicineChange(e, index)}
                    >
                      <option value="">Select</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Night">Night</option>
                      <option value="Morning-Afternoon">
                        Morning-Afternoon
                      </option>
                      <option value="Morning-Night">Morning-Night</option>
                      <option value="Afternoon-Night">Afternoon-Night</option>
                      <option value="Morning-Afternoon-Nigth">
                        Morning-Afternoon-Nigth
                      </option>
                    </select>
                    {/*errors?.timeSlots?.[index]?.day && (
                      <p className="text-red-300">
                        {errors?.timeSlots?.[index]?.day}
                      </p>
                    )*/}
                  </div>
                </div>

                <button
                  className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px]
                cursor-pointer"
                  onClick={(e) => deleteMedicine(e, index)}
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addMedicine}
            className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Medicines
          </button>
        </div>

        <div className="mb-5">
          <p className="from__label">Test Reports</p>
          <div className="image-uploader flex flex-wrap gap-3">
            {/* Four file input fields for images */}
            {formData.testReport.map((item, index) => (
              <div key={index} className="">
             
                <label htmlFor={`reports-${index}`}>

                  <img
                    src={ item.img || addImage}
                    className="w-[300px] cursor-pointer border-4 border-gray-100  shadow-lg hover:border-gray-200"
                    alt="avatar"
                  />
                </label>

                {/* Input for selecting a new profile picture */}
                <input
                  type="file"
                  id={`reports-${index}`}
                  name="img"
                  accept="image/*"
                  onChange={(e)=>handleTestReportChange(e,index)}
                  style={{ display: "none" }} // Hide the input visually but keep it accessible
                />

                <button
                  className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px]
                cursor-pointer"
                  onClick={(e) => deleteTestReports(e, index)}
                >
                  <AiOutlineDelete />
                </button>
              </div>
            ))}
            <button
              onClick={addImg}
              className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
            >
              Add Images
            </button>
          </div>
        </div>
        <div className="mt-7">
          <button
            type="submit"
            className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg"
          >
           { action ? "Edit Record" : "Add Record" }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPrescription;
