const board=document.getElementById('board');
let pieces=[],size=3;

async function newGame(){
size=+document.getElementById('size').value;
const img=`https://picsum.photos/600?random=${Date.now()}`;
pieces=[];
for(let i=0;i<size*size;i++) pieces.push(i);
pieces.sort(()=>Math.random()-0.5);
render(img);
}

function render(img){
board.style.gridTemplateColumns=`repeat(${size},1fr)`;
board.style.width='320px';
board.innerHTML='';
pieces.forEach((p,i)=>{
const d=document.createElement('div');
d.className='tile';
d.style.aspectRatio='1';
d.style.backgroundImage=`url(${img})`;
d.style.backgroundPosition=`${(p%size)*100/(size-1)}% ${Math.floor(p/size)*100/(size-1)}%`;
d.onclick=()=>{
if(i>0){[pieces[i],pieces[i-1]]=[pieces[i-1],pieces[i]];render(img);}
};
board.appendChild(d);
});
}
newGame();
