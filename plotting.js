

module.exports = class Plotting
{

    static actions;
    static currentAction = 0;

    static Aport;

    static start(act, ap)
    {
        this.actions = act;
        this.Aport = ap;
        this.runPlot();
    }
    static runPlot()
    {
        setInterval(() => {
            if (this.currentAction <= this.actions.length)
            {
                console.log(this.actions[this.currentAction])
                this.Aport.write(this.actions[this.currentAction]);
                this.currentAction += 1;
            }
        }, 1000);
    }
}