import { Badge } from "antd";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {useCart} from '../../context/cart';

export default function ProductCard({p}) {
    // context
    const [cart, setCart] = useCart()
    // hook
    const navigate = useNavigate()

    return(
        <div className="card mb-3 my-card">

        <Badge.Ribbon text={`${p?.sold} sold`} color="red">
            <Badge.Ribbon text={`${p?.quantity >= 1 ? `${p.quantity} In Stock` : 'Out of stock'}`} placement="start" color="green">
                <img src={`${process.env.REACT_APP_API}/product/photo/${p._id}`} 
                    alt={p.name}
                    style={{ height:"300px" }}
                    className="my-card-img card-img-top"   
                    />
            </Badge.Ribbon>
        </Badge.Ribbon>
            
                 <div className="card-body">
                   <h5>{p?.name}</h5>

                    <h4 className="fw-bold">
                        {p?.price?.toLocaleString("MYR", {
                            style:"currency",
                            currency:"MYR",
                        })}
                    </h4>

                   <p className="card-text">{p.description?.substring(0, 60)}...</p>
                 </div>

                 <div className="d-flex justify-content-between">
                    <button 
                        className="btn btn-primary col card-button" 
                        style={{ borderBottomLeftRadius: "5px" }}
                        onClick={() => navigate(`/product/${p.slug}`)}
                        >
                        View Product
                    </button>

                    <button
                     className="btn btn-outline-primary col card-button"
                     style={{ borderBottomRightRadius: "5px" }}
                     onClick={() => {
                        setCart([...cart, p]); // keep whatever in cart state and add new product to cart.
                        localStorage.setItem("cart", JSON.stringify([...cart, p]));
                        toast.success("Added to cart!");
                     }}
                     >
                        Add to cart
                    </button>
                 </div>

                {/* <p>{moment(p.createdAt).fromNow()}</p>  
                <p>{p.sold} sold</p> */}

        </div>
    )
}