import { useAuth } from "../context/auth";
import {useCart} from '../context/cart';
import Jumbotron from "../components/cards/Jumbotron";
import { useNavigate } from "react-router-dom";
import UserCartSidebar from '../components/cards/userCartSidebar';
import ProductCardHorizontal from "../components/cards/productCardHorizontal";

export default function Cart() {
    // context
    const [cart, setCart] = useCart();
    const [auth,  setAuth] = useAuth();

    //hook
    const navigate = useNavigate();

   

   

    return (
     <>
        <Jumbotron 
            title={`Hello ${auth?.token && auth?.user?.name}`}
            // 1. cart mora than 1 ? u hv X items... else "your card is empty"
            //2. 2nd condition if have item in card and not login, show "pls login.."
            subTitle={
                cart?.length ? `You have ${cart.length} items in the cart. ${auth?.token ? "" : "please login to checkout"}`
        : "Your cart is empty"
                }
        />

        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="p-3 mt-2 mb-2 h4 bg-light text-center">
                        {cart?.length? "My Cart" : (
                            <div className="text-center">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate("/")}
                                >
                                    Continue Shopping
                                </button>

                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>

        {cart?.length && (
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                       <div className="row">
                            {cart?.map((p, index) => (
                                <ProductCardHorizontal key={index} p={p} />
                            ))}
                       </div>
                    </div>
                      <UserCartSidebar />
                </div>
            </div>
        )}
     </>   
    );
}