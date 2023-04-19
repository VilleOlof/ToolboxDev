export namespace ModuleHandler {

    export enum ComponentSize {
        Small = "Small",
        Large = "Large"
    }

    export function RegisterModule(moduleName: string, componentSize: ComponentSize, description?: string): void {
        document.querySelector(`#${moduleName}`).parentElement.classList.add(`is-${componentSize.toLowerCase()}`);
    }
}