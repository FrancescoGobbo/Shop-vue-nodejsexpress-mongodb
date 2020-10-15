import axios from 'axios';

//const url = 'http://localhost:5000/api/shop';

class ShopService{
    //Get user
    static async getUsers(){
        /*eslint-disable*/
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get('http://localhost:5000/api/shop/user');
                const data = res.data;
                console.log(res.data);
                resolve( 
                    data.items
                );
            }catch(err){
                reject(err);
            }
        })
    }
    //Get articles
    static async getArticles(){
        /*eslint-disable*/
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get('http://localhost:5000/api/shop/articles');
                const data = res.data;
                console.log(res.data);
                resolve( 
                    data.items
                );
            }catch(err){
                reject(err);
            }
        })
    }
    //Get orders
    static async getOrders(){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get('http://localhost:5000/api/shop/orders');
                const data = res.data;
                console.log(res.data);
                resolve( 
                    data.items
                );
            }catch(err){
                reject(err);
            }
        })
    }
    //updateOrder
    static async updateOrder(updateO){
        return axios.post('http://localhost:5000/api/shop/uporders', {
            items: updateO
        }
        );
        
    }
    //update Articles
    static async updateArticles(updateA){
        return axios.post('http://localhost:5000/api/shop/uparticles', {
            items: updateA
        }
        );
    }
}

export default ShopService;