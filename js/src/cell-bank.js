
(function(SeaBattle,$){

SeaBattle.CellBank = function(field,cellType){
    this.cells = [];
    const SIZE=10; 

    for(let i=0;i<SIZE;i++){
        for(let j=0;j<SIZE;j++){
            let cell = new cellType(j,i,field);
            this.cells.push(cell);          
        }
    }         

    this.getCell=function(x,y){
        return this.cells[y*SIZE+x];
    }

    this.setCellState=function(x,y,state){
        this.getCell(x,y).setState(state);        
    }
}
})(SeaBattle=SeaBattle|| {},jQuery)