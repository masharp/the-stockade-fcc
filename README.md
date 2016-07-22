#The Stockade
  * This is a full-stack web application that tracks the trends of stocks by symbol.
    Displays the trend lines over a selectable time. Stock symbols can be added and removed.
    Symbols sync over all clients in real-time. The application is currently limited to a maximum
    of 6 tracked stock symbols due to API constraints.  

    Powered by Node.js, React.js, Highcharts, and WebSockets. Part of the FreeCodeCamp curriculum.
    A working prototype of this application can be found [here](http://the-stockade.herokuapp.com)  

    The stock market data used in this app is provided by Markit On Demand Market Data API (v2)
    and can be found at http://dev.markitondemand.com/MODApis/  

    User Stories:  
      * User Story: I can view a graph displaying the recent trend lines for each added stock.
      * User Story: I can add new stocks by their symbol name.
      * User Story: I can remove stocks.
      * User Story: I can see changes in real-time when any other user adds or removes a stock.  

    www.softwareontheshore.com
    Michael Sharp 2016
    michael@softwareontheshore.com

#Change Log

## Mar. 14, 2016
  * Initial Commit

## July 18, 2016
  * Dusted off project
  * Refactored for webpack

## July 22. 2016
  * Finished all functionality
  * Finished desktop styling
  * Deployed to Heroku
