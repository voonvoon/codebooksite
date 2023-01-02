import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import { Select } from 'antd';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export default function AdminProduct () {
    // context
    const [auth, setAuth] = useAuth();
    // state
    const [categories, setCategories] = useState([]);
    const [photo, setPhoto] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");    // tis for product , 1 product
    const [shipping, setShipping] = useState("");
    const [quantity, setQuantity] = useState("");

    //hook
    const navigate =  useNavigate();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const { data } = await axios.get("/categories");
            setCategories(data);
        } catch (err) {
            console.log(err)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {   
           const productData = new FormData();  // create new instance try to submit form-data
           productData.append("photo", photo);
           productData.append("name", name);
           productData.append("description", description);
           productData.append("price", price);
           productData.append("category", category);
           productData.append("shipping", shipping);
           productData.append("quantity", quantity);

           const { data } = await axios.post("/product", productData);
           if(data?.error) {
              toast.error(data.error)
           } else {
            toast.success(`"${data.name}" is created`);
            navigate("/dashboard/admin/products");
           }
          
        } catch (err) {
            console.log(err);
            toast.error("Product create failed. Try again!");
        }
    }


    return (
        <>
            <Jumbotron title={`Hello ${auth?.user?.name}`}
                        subTitle="Admin Dashboard"
            />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                       <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="p-3 mt-2 mb-2 h4 bg-light">Create product</div>

                        {photo && (
                            <div className="text-center">
                                <img 
                                    src={URL.createObjectURL(photo)} 
                                    alt="Product photo"
                                    className="img img-responsive"
                                    height="200px"    
                                    />   
                            </div>
                        )}

                        <div>
                            <label className="btn btn-outline-secondary p-2 col-12 mb-3">
                                {photo ? photo.name : "Upload photo"}
                                <input 
                                    type="file"
                                    name="photo"
                                    accept="image/*"   //* =  accept all type file 
                                    onChange={(e) => setPhoto(e.target.files[0])}  // [0] cuz we wat 1st item
                                    hidden
                                />
                            </label>
                          
                        </div>

                        <input 
                            type="text" 
                            className="form-control p-2 mb-3"
                            placeholder="Write a name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <textarea 
                            type="text" 
                            className="form-control p-2 mb-3"
                            placeholder="Write a description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input 
                            type="number" 
                            className="form-control p-2 mb-3"
                            placeholder="Enter a price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                    <Select
                        //showSearch
                        bordered={false}
                        size="large"
                        className="form-select mb-3"
                        placeholder="Choose category"
                        onChange={(value) => setCategory(value)}
                    >
                        {categories?.map((c) => (
                            <Option key={c._id} value={c._id}> 
                                {c.name}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        bordered={false}
                        size="large"
                        className="form-select mb-3"
                        placeholder="Choose shipping"
                        onChange={(value) => setShipping(value)}
                    >
                         <Option value="0">No</Option>
                         <Option value="1">Yes</Option>
                    </Select>

                    <input 
                            type="number" 
                            min="1"
                            className="form-control p-2 mb-3"
                            placeholder="Enter Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />

                        <button onClick={handleSubmit} className="btn btn-primary mb-5">Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}