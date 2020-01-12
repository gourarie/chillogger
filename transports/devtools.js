const levelsColors = {
    "alert": "#ee4035",
    "error": "#ee4035",
    "warn": "#ff6700",
    "info": "#7bc043",
    "debug": "#422c6b",
    
    "red": "#ee4035",
    "orange": "#ff6700",
    "purpule": "#422c6b",
    "green": "#7bc043",
    "blue": "#0392cf"
  }
  
  const levelLabelCssBase = {
    "color": "#ffffff",
    "padding": "0px 10px",
    "margin-left": "10px",
    "border-radius": "20px",
    "text-decoration": "none"
  }


  function labelCss(level) {
    return `${labelCssBaseString};background-color:${levelsColors[level]};`
  }
  
  const labelCssBaseString = Object.keys(levelLabelCssBase).reduce((css, key) => {
    css.push(`${key}:${levelLabelCssBase[key]}`)
    return css;
  }, []).join(";");
  
  function formatDate(ts) {
    let [match,yy,mm,dd,t,ms] = /[0-9]{2}([0-9]{2})-([0-9]{2})-([0-9]{2})T([0-9:]{8})\.([0-9]{3})/.exec(new Date(ts).toISOString());
    let timeString = `${yy}${mm}${dd} ${t}${process.env.trace ? `.${ms}` : ''}`
    return timeString;
  }
  
  function printToDevTools({
    ts,
    cc,
    msg,
    level,
    meta,
    src,
    host
  }){
    let args = [
      `%c${level}%c ${formatDate(ts)} %c${cc} %c${src.file}:${src.line} %c${msg}`,
      labelCss(level),
      "color: #939393", 
      "color: #20C20E",
      "color: blue",
      ""
    ];
    if (meta.length){
      console.groupCollapsed.apply(this,args)
      meta.forEach(console.log)
      console.groupEnd();
    }
    else console.log.apply(this,args)
  }