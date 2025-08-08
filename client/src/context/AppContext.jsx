import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) =>{
     const [user, setUser] = useState(null);
     const [showLogin, setShowLogin] = useState(false);
     const [token , setToken] = useState(localStorage.getItem('token'));
     const [credit, setCredit] = useState(false);

     const backendUrl = import.meta.env.VITE_BACKEND_URL;

     const navigate = useNavigate();



     // fn for generate image
     const generateImage = async(prompt)=>{

      try {
         const { data } = await axios.post(backendUrl + '/api/image/generate-image', {prompt}, {headers: {token}});

         if(data.success){
            getCreditData();
            return data.resultImage;
         }
         else {
            toast.error(data.message);
            getCreditData();
            if(data.creditBalance === 0){
               navigate('/buy');
            }
         }
      } catch (error) {
         console.log(error);
         toast.error(error.message);
      }
     }


    // get the credit data from backend
     const getCreditData = async()=>{
      try {

         const { data } = await axios.get(backendUrl + '/api/user/credits', {headers: {token}});

         if(data.success){
            setCredit(data.credits);
            setUser(data.user);
         }

      } catch (error) {
         console.log(error.message);
         toast.error(error.message);
      }
     }

     const logOut = ()=>{
      localStorage.removeItem('token');
      setToken('');
      setUser(null);
      toast.success("Logged out successful");
     }

     useEffect(()=>{
      if(token){
         getCreditData();
      }
     }, [token])



     const value = {
        user, 
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        getCreditData, logOut,
        generateImage
     }

     return (
        <AppContext.Provider value={value}>
           {children}
        </AppContext.Provider>
     )

}


export default  AppContextProvider;