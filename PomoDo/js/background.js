function getSeason(d) {
  d = d || new Date();
  let mon = d.getMonth() + 1;
  let day = d.getDate();

  //Winter
  if (mon >= 1 && mon <= 2) {
    return ['winter'];
  }

  //Spring
  else if (mon >= 2 && mon <= 6) {
    return ['spring'];
  }

  //Summer
  else if (mon >= 6 && mon <= 8) {
    return ['summer'];
  }

  //Fall
  else if (mon == 9) {
    return ['fall'];
  }

  //Fall+Halloween
  else if (mon == 10) {
    if (day >=1 && day <=30) {
      return ['fall'];
    }
    else if (day == 31) {
      return ['halloween'];
    }
  }

  //Fall
  else if (mon==11) {
    return ['fall'];
  }

  //Winter+Christmas
  else if (mon == 12) {
    if (day >= 1 && day <= 7) {
      return ['winter'];
    }
    else if (day >= 8 && day <= 31) {
      return ['christmas'];
    }
  }

}

let seasonClasses = getSeason();
seasonClasses.forEach(function(seasonClass){
	document.body.classList.add(seasonClass)
});
