(function($){
    
    SeaBattle =  {};
   

    SeaBattle.App=function(config){
        var  
            Field   = SeaBattle.Field,
            DebugAttackMatrixField  = SeaBattle.DebugAttackMatrixField,
            Ship    = SeaBattle.Ship,
          
            OpenedCell  = SeaBattle.OpenedCell,
            ClosedCell  = SeaBattle.ClosedCell;

        let _this=this;
        let playerField = new  Field({cellType:SeaBattle.OpenedCell});
        let compField = new  Field({cellType:SeaBattle.ClosedCell});
        this.debug=config.debug;
        let activePlayerIndex = 0;
        let $statusBarContainer = config.statusBar,
        $dialogContainer=config.dialog,
        
        $computerNameContainer=config.computerName;
        $playerNameContainer=config.playerName;
        
        this.getHumanField = function(){
            return playerField;
        }
    
        let players = [];
        
        config.playerFieldContainer.append(playerField.render());
        config.compFieldContainer.append(compField.render());
        
        if(this.debug){
             
            this.debugAttackMatrixField = new DebugAttackMatrixField();
            $('#debug-container').append(this.debugAttackMatrixField.render());    
        }
    
        addShipsToField=function(field){
            for(let i=4;i>0;i--){
                for(let j=4-i+1;j>0;j--){                   
                    field.addShip(new Ship(i));
                }
            }
        }
    
       
    
        let getNextPlayer=function(){
            
            if(activePlayerIndex>=players.length-1){
                activePlayerIndex=0;
            } else {
                activePlayerIndex++;
            }
            let activePlayer =  players[activePlayerIndex];
            return activePlayer;
        }
    
        
        this.gameOver = function(){
            for(let player of players){
                let allShipsisDead=true;
                for(let ship of player.targetField.ships){
                    if(!player.targetField.isShipDead(ship)){
                            allShipsisDead= false;
                    }
                }
                if(allShipsisDead){
                    return true;
                }
            }
            return false;
        }
    
        function runNextPlayerAttack(isLastAttackSuccess){
            let activePlayer;
            if(!isLastAttackSuccess){
                activePlayer = getNextPlayer();
                $statusBarContainer.text(activePlayer.name+' turn...'); 
            } else {
                activePlayer = players[activePlayerIndex];
            }
           
            activePlayer.attack().then(function(attackCoords){ 
           
            let attackResults = activePlayer.targetField.processAttack(attackCoords);
            activePlayer.processAttackResult(attackCoords,attackResults.state);
            if(attackResults.success){
                $statusBarContainer.text(activePlayer.name+' attack success'); 
            } else {
                $statusBarContainer.text(activePlayer.name+' attack fail');                 
            }
            if(_this.gameOver()){
                alert('Game Over');
                return;
            }
            runNextPlayerAttack(attackResults.success);
            });
        }
    
        let runGameButtonHandler = function(e){
            addShipsToField(playerField);
            addShipsToField(compField);
            runNextPlayerAttack(false);
            $(this).off( "click" );
        };
        
        let showModal=function(){
            return new Promise(function(ResolveCallback,RejectCallback){
                dialog = $dialogContainer.dialog({
                    dialogClass: "no-close",   
                    buttons: {
                        "Next": function(){
                            if ($('#computer-name').val() && $('#player-name').val()){
                                dialog.dialog('close');
                                return true;
                            }
                            return false;
                        }
                      },
                      close: function() {
                        ResolveCallback({computerName:$('#computer-name').val(), playerName:$('#player-name').val()});
                      },             
                    autoOpen: false,
                    height: 400,
                    width: 350,
                    modal: true,});
                    dialog.dialog( "open" );
            });

        }

        this.run=function(){
           

            showModal().then(function(result){
                let CompPlayer=SeaBattle.CompPlayer,HumanPlayer=SeaBattle.HumanPlayer;
                players.push(   new CompPlayer(result.computerName,playerField));
                players.push(   new HumanPlayer(result.playerName, compField));
                $computerNameContainer.text(result.computerName);
                $playerNameContainer.text(result.playerName);
                config.runButton.click(runGameButtonHandler);
            },function(error){

            });
              
           
        }
    }
})(jQuery)
