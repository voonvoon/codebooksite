import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import toast from 'react-hot-toast';
import CategoryForm from "../../components/forms/CategoryForm";
import {Modal} from 'antd';

export default function AdminCategory () {
    // context
    const [auth, setAuth] = useAuth();
    // state
    const [name, setName] = useState("");  //use to create cat 
    const [catagories, setCategories] = useState([]); // will be array of cat
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatingName, setUpdatingName] = useState(""); // use to update cat

    useEffect(() => {
        loadCategories();
    },[]);

    const loadCategories = async () => {
        try {
            const { data } = await axios.get("/categories");
            setCategories(data);
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (e) => {               // is a event handle func
        e.preventDefault();   // prevent pg reload
        try {
            const { data } = await axios.post("/category", { name });
            if(data?.error) {
                toast.error(data.error)
            } else {
                loadCategories();     // add here so once it submit immediately will show btn below
                setName("");
                toast.success(`"${data.name}" is created!`)
            }
        } catch (err) {
            console.log(err);
            toast.error("Create category failed, pls try again!")
        }   
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`/category/${selected._id}`, {
                name: updatingName,
            });
            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success(`"${data.name}" is updated!`);
                setSelected(null);
                setUpdatingName("");
                loadCategories();
                setVisible(false);
            }
        } catch (err) {
            console.log(err);
            toast.error("Category may already exist, please try again.")
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.delete(`/category/${selected._id}`);
            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success(`"${data.name}" has been deleted!`);
                setSelected(null);
                loadCategories();
                setVisible(false);
            }
        } catch (err) {
            console.log(err);
            toast.error("Category may already exist, please try again.")
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
                        <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Categories</div>
                        <CategoryForm 
                            value={name}
                            setValue={setName}
                            handleSubmit={handleSubmit}
                        />
                        

                        <hr/>
                            <div className="col">
                                    {catagories?.map((c) => (                       // c= cat
                                            <button key={c._id} className="btn btn-outline-primary m-3"
                                             onClick={() => {
                                                setVisible(true);
                                                setSelected(c);
                                                setUpdatingName(c.name);
                                            }}>
                                                {c.name}
                                            </button>
                                    ))}

                            </div>

                            <Modal 
                            open={visible} 
                            onOk={() => setVisible(false)}
                            onCancel={() => setVisible(false)}
                            footer={null}
                            >
                            <CategoryForm 
                            value={updatingName}
                            setValue={setUpdatingName}
                            handleSubmit={handleUpdate}
                            buttonText = "Update"
                            handleDelete = {handleDelete}
                            />
                            </Modal>
                    </div>
                </div>
            </div>
        </>
    )
}