

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
        this.Aport.write(this.actions[this.currentAction]);
            this.currentAction += 1;
    }
}