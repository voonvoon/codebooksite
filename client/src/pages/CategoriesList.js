import useCategory from '../hooks/useCategory';
import Jumbotron from '../components/cards/Jumbotron';
import {Link} from 'react-router-dom';   // can use navigate & link

export default function CategoriesList() {
    const categories = useCategory()

        return (
          <>
            <Jumbotron title="Categories" subTitle="List of all categories" />

            <div className='container-overflow-hidden'>
                <div className='row gx-2 gy-2 mt-3 mb-5'>
                    {categories?.map(c => (
                        <div className='col-md-6' key={c._id}>
                            <button className='btn btn-light col-12 text-dark p-3'>
                               <Link 
                               className=''
                               style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }} 
                               to={`/category/${c.slug}`}>{c.name}
                               </Link> 
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </>

        )
}