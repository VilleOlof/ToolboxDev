<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';

    const componentID: string = "ImportYoutubeMembers";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Small);
    });

    let _Settings = GlobalSettings.GetInstance(componentID);

    _Settings.RegisterSetting(
        'Format Template',

`How to format the incoming data
{Member} = Member name
{Link to profile} = Link to profile
{Current level} = Current level
{Total time on level (months)} = Total time on level (months)
{Total time as member (months)} = Total time as member (months)
{Last update} = Last update
{Last update timestamp} = Last update timestamp

eval() = Evaluate Javascript Code For Further Customization`, 

        '{Current level} {Member}\n', 
        SettingTypes.Type.Text
    );

    type YoutubeMember = {
        "Member": string;
        "Link to profile": string;
        "Current level": string;
        "Total time on level (months)": string;
        "Total time as member (months)": string;
        "Last update": string;
        "Last update timestamp": string;
    }

    function ConvertCSVToObject(CSVInput: string): YoutubeMember[] {
        const Lines = CSVInput.split('\n');     

        let members: YoutubeMember[] = [];
        const headers: string[] = Lines[0].split(',');

        for (var i = 1; i < Lines.length; i++) {
            const data = Lines[i].split(',');

            let member: any = {};

            for (var j = 0; j < data.length; j++) {
                member[headers[j].trim()] = data[j].trim();
            }

            if (!member["Member"]) continue;

            members.push(member);
        }

        return members;
    }

    function FormatString(template: string, Member: YoutubeMember): string {
        let output = template;

        //Regex wizardry
        const evalRegex: RegExp = new RegExp('eval\\(((?:[^()]|\\((?:[^()]|\\([^()]*\\))*\\))*)\\)');

        for (const [key, value] of Object.entries(Member)) {
            output = output.replace(`{${key}}`, value);
        }

        for (let i = 0; i < Object.entries(Member).length; i++) {
            const test = evalRegex.test(output);
            if (!test) continue;

            let evalString = (output.match(evalRegex)[0])

            evalString = evalString.substring(5);
            evalString = evalString.substring(0, evalString.length - 1);
            
            output = ((output.replace(evalRegex, eval(evalString)).replace(')', '')));
        }

        return output;
    }

    const CSVButton = () => {
        const CSVFiles = Common.IO.Dialog({
            title: "Select CSV file", 
            defaultPath: process.env.USERPROFILE + "/Downloads",
            filters: [
                { name: 'CSV', extensions: ['csv'] }
            ],
            properties: ['openFile']
        });

        if (CSVFiles.length < 1) return;

        const CSVFileData: string = Common.IO.ReadFile(CSVFiles[0]);
        const CSVData: YoutubeMember[] = ConvertCSVToObject(CSVFileData);

        CSVData.forEach((member: YoutubeMember) => {
            console.log(FormatString(_Settings.GetSettingValue('Format Template'), member))
        });
    }

</script>


<main id={componentID}>
    <button on:click={CSVButton}>Convert</button>
</main>


<style lang="scss">

</style>