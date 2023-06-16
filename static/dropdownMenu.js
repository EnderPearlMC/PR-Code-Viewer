let buttons = document.getElementsByClassName("top-button")
let dropMenus = document.getElementsByClassName("dropdown") 

setInterval(() => {
    for (let i = 0; i < buttons.length; i++)
    {
        if (buttons.item(i).matches(':hover'))
        {
            console.log(buttons.item(i).classList[1])
            for (let j = 0; j < dropMenus.length; j++)
            {
                if (buttons.item(i).classList[1].split("_")[1] == dropMenus.item(j).classList[1].split("_")[1])
                {
                    dropMenus.item(j).style.display = "block";
                }   
            }
        }
        if (!buttons.item(i).matches(':hover'))
        {
            for (let j = 0; j < dropMenus.length; j++)
            {
                if (buttons.item(i).classList[1].split("_")[1] == dropMenus.item(j).classList[1].split("_")[1])
                {
                    if (!dropMenus.item(j).matches(":hover"))
                    {
                    dropMenus.item(j).style.display = "none";
                    }
                }   
            }
        }
    }
}, 1);