<template>
  <div class="container">
    <div class="test">
      <h1>Shop</h1>
      <hr>
      <div class="utenti">
        <div class="shop" v-for="(user_alias, index) in User" v-bind:item="user_alias" v-bind:key="index">
            <form v-if="user_alias._id == '5e4fde5d21146d12587ffd98'"><B class="title">User </B>{{ user_alias.name }}</form>
        </div>
      </div>
      <hr>
      <div class="ordini">
        <p><B class="title">Orders</B></p>
        <div v-if="getCorrectOrder() == true">
          <div class="shop" align="center" valign="middle" v-for="(order_alias,index) in Orders" v-bind:item="order_alias" v-bind:key="index" >
            <table>
              <tr class="table">
                <td>Id article</td>
                <td>Name article</td>
                <td>Numbers of article</td>
                <td>Add or remove</td>
              </tr>
              <tr class="articoliordinati" v-for="(elm,index) in order_alias.articles"  v-bind:articles="elm" v-bind:key="index">
                <td>{{elm.article_id}}</td>
                <td>{{ getArticlesName(elm.article_id) }}</td>
                <td>{{elm.qty}} / {{getNArticles(elm.article_id)}}</td>
                <td class="AddRemove">
                  <button class="button" v-on:click="addArticle(order_alias._id, elm.article_id)">+</button>
                  <button class="button" v-on:click="removeArticle(order_alias._id, elm.article_id)">-</button>
                </td>
              </tr>
            </table>
            <br>
            <div class="stato">
              <p><b>Total: </b>{{ getTotal(order_alias._id) }} €</p>
              <p><b>Status: </b>{{order_alias.status}}</p>
            </div>
            <button class="ButtonC" v-on:click="confirmOrder(order_alias._id)">Confirm</button>
          </div>
        </div>
        <div v-else>
          {{myPopup("Errore utente")}}
        </div>
      </div>
      <div class="Event">
        <transition name="fade" appear>
          <div class="modal-overlay" v-if="showModal" @click="showModal = false"></div>
        </transition>
        <transition name="popup" appear>
          <div class="popup" v-if="showModal">
            <h1>Error</h1>
            <p>{{ MessageError }}</p>
            <button class="ButtonC" v-on:click="showModal = false">Close</button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Shop from '../ShopService';

export default {
  name: 'shop',
  data() {
    return{
      User:[],
      Articles: [],
      Orders: [],
      showModal:false,
      MessageError: ''
    }
  },
  async beforeMount() {
    try{
      this.User = await Shop.getUsers();
      this.Articles = await Shop.getArticles();
      this.Orders = await Shop.getOrders();

    }catch(err) {
      this.error = err.message;
    }
  },

  methods: {
    reloadPage(){
      console.log('ricarica');
      window.location.reload();
    },

    myPopup(text){
      this.showModal=true,
      this.MessageError= text;
    },
    
    //User's methods
    getCorrectOrder(){
      if(this.User._id == this.Orders.user)
        return true;
      else 
        return false;
    },

    //Articles's methods
    getArticlesName(idA){
      var i=0;
      var fine= false;
      while(!fine){
        if((this.Articles[i]._id)==idA){
          fine=true;
        }
        else{
          i++;
        }
      }
      return this.Articles[i].name;
    },
    getArticlesPrice(idA){
      var trovato = false;
      var i = 0;
      while(i<this.Articles.length && !trovato){
        if(idA == this.Articles[i]._id){
          trovato = true;
        }
        else
          i++;
      }
      return this.Articles[i].price;
    },
    getNArticles(artid){
      var i=0;
      while(artid!=this.Articles[i]._id){i++;}
      return this.Articles[i].available_quantity;
    },
    changeAvaiabilityArticles(articoliO){
      for(var i=0; i<articoliO.length; i++){
        for(var j=0; j<this.Articles.length; j++){
          if(articoliO[i].article_id == this.Articles[j]._id){
            this.Articles[j].available_quantity-=articoliO[i].qty;
          }
        }
      }
    },

    //Order's methods
    getTotal(idO){
      var i=0;
      while(idO!=this.Orders[i]._id){i++;}
      var ordine = this.Orders[i];
      var total=0;
      for(var j=0; j<ordine.articles.length; j++){
        total+=ordine.articles[j].qty*(this.getArticlesPrice(ordine.articles[j].article_id));
      }
      return total;
    },

    addArticle(idO, idA){
      var i=0;
      var trovato = false;
      while(i<this.Orders.length && !trovato){
        if(this.Orders[i]._id == idO)
          trovato = true;
        else 
          i++;
      }
      var articoliOrdine = this.Orders[i].articles;
      var j=0;
      trovato = false;
      while(j<articoliOrdine.length && !trovato){
        if(articoliOrdine[j].article_id == idA){
          trovato = true;
          if(articoliOrdine[j].qty+1<=this.getNArticles(articoliOrdine[j].article_id)){
            articoliOrdine[j].qty+=1;
            this.Orders.articles=articoliOrdine;
            //UpdateOrders?
          }
          else{
            this.myPopup("Not enough articles");
          }
        }else 
          j++;
      }
    },

    removeArticle(idO, idA){
      var i=0;
      var trovato = false;
      while(i<this.Orders.length && !trovato){
        if(this.Orders[i]._id == idO)
          trovato = true;
        else 
          i++;
      }
      var articoliOrdine = this.Orders[i].articles;
      var j=0;
      trovato = false;
      while(j<articoliOrdine.length && !trovato){
        if(articoliOrdine[j].article_id == idA){
          trovato = true;
          if(articoliOrdine[j].qty-1<=0){
            var errore=0;
            articoliOrdine[j].qty-=1;
            for(var k=0; k<articoliOrdine.length; k++){
              if(articoliOrdine[k].qty==0){
                errore++;
              }
            }
            if(errore==articoliOrdine.length){
              articoliOrdine[j].qty=1;
              this.myPopup("You can't order nothing");
            }
            else if(articoliOrdine[j].qty<0){
              articoliOrdine[j].qty=0;
              this.myPopup("You can't order a negative number of articles");
            }
            else{
              console.log(articoliOrdine[j].qty);
              this.Orders.articles=articoliOrdine;
              //UpdateOrders?
            }
          }
          else{
            articoliOrdine[j].qty-=1;
              this.Orders.articles=articoliOrdine;
          }
        }else 
          j++;
      }
    },

    checkAvaiabilityArticles(articoliO){
      var corretto = true;
      for(var i=0; i<articoliO.length; i++){
        for(var j=0; j<this.Articles.length; j++){
          if(articoliO[i].article_id == this.Articles[j]._id){
            if(articoliO[i].qty>this.Articles[j].available_quantity){
              corretto= false;
            }
          }
        }
      }
      return corretto;
    },

    async confirmOrder(idO){
      var i=0;
      var trovato = false;
      while(i<this.Orders.length && !trovato){
        if(this.Orders[i]._id == idO)
          trovato = true;
        else 
          i++;
      }
      if(this.Orders[i].status != 'confrirmed'){  
        this.Orders[i].status = 'confrirmed';
        if(this.checkAvaiabilityArticles(this.Orders[i].articles)){
          this.changeAvaiabilityArticles(this.Orders[i].articles);
          await Shop.updateArticles(this.Articles);
          await Shop.updateOrder(this.Orders[i]);
          this.reloadPage();
        }
        else{
          this.myPopup("You had an error into your order");
        }
      }else{
        this.myPopup("This order is already confirmed");
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 15px;
  text-align: center;
}
.utenti{
  padding: 15px;
  margin-left: 50px;
  text-align: left;
}
.title{
  color: #42b983;
  font-size: 25px;
}
.table{
  font-weight: bold;
}


.button {
 appearance: none;
 outline: none;
 border: none;
 background: none;
 cursor: pointer;
 
 display: inline-block;
 width: 30px;
 height: 30px;
 background-image: linear-gradient(to right, #215840, #42b983);
 border-radius: 8px;
 
 color: #FFF;
 font-size: 18px;
 font-weight: 700;
 
 box-shadow: 3px 3px rgba(0, 0, 0, 0.4);
 transition: 0.4s ease-out;
}

.ButtonC{
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  
  display: inline-block;
  
  background-image: linear-gradient(to right, #215840, #42b983);
  border-radius: 8px;
  
  color: #FFF;
  font-size: 18px;
  font-weight: 700;
  padding: 10px 25px;
  box-shadow: 3px 3px rgba(0, 0, 0, 0.4);
  transition: 0.4s ease-out;
}

.modal-overlay {
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 z-index: 98;
 background-color: rgba(0, 0, 0, 0.3);
}
.popup {
 position: fixed;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 z-index: 99;
 
 width: 100%;
 max-width: 400px;
 background-color: #FFF;
 border-radius: 16px;
 
 padding: 25px;
}
.popup .h1 {
  color: red;
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 15px;
}
 
.popup p {
  color: #666;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 15px;
}

.fade-enter-active,
.fade-leave-active {
 transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
 opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
 transition: transform .5s;
}

.slide-enter,
.slide-leave-to {
 transform: translateY(-50%) translateX(100vw);
}

</style>

