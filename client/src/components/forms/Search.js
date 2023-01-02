//import {useState, useEffect} from 'react';
import axios from 'axios';
import { useSearch } from '../../context/search';
import { useNavigate } from 'react-router-dom';


export default function Search() {
    // const [keyword, setKeyword] = useState("");
    // const [results, setResults] = useState([]);
    // hook
    const [values, setValues] = useSearch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const { data } = await axios.get(`/products/search/${values?.keyword}`);
          //console.log(data);
          setValues({ ...values, results: data});
          navigate("/search");  
        } catch (err) {
            console.log(err)
        }
    };

    return (
        // use onSubmit here so when press enter in the form will submit, can use onsubmit in btn if u like
        <form className="d-flex" onSubmit={handleSubmit}> 
            <input
                type="search"
                style={{ borderRadius: "0px" }}
                className="form-control"
                placeholder="Search"
                onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                value={values.keyword}
            />
            <button className="btn btn-outline-primary"
            type="submit"
            style={{ borderRadius: "0px" }}
            >
            Search
            </button>
            {console.log(values)}
        </form>
    )
}
