import { AllCommunityModule, ColDef, ModuleRegistry, ValueFormatterParams, colorSchemeDark, colorSchemeLight, themeQuartz } from 'ag-grid-community';
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import { Worker } from '../../../../../models/Worker';
import { useEffect, useMemo, useState } from 'react';
import UnitConverter from '../../../../../lib/UnitConverter';
import { AG_GRID_LOCALE_FR } from "../../../../../locale/fr-FR";
import { HashrateCell } from './components/HashrateCell';



ModuleRegistry.registerModules([AllCommunityModule]);


export function MainGrid({
    workers,
    isHashrate1mVisible,
    isHashrate5mVisible,
    isHashrate1hrVisible,
    isHashrate1dVisible,
    isHashrate7dVisible
}: {
    workers: Worker[],
    isHashrate1mVisible: boolean,
    isHashrate5mVisible: boolean,
    isHashrate1hrVisible: boolean,
    isHashrate1dVisible: boolean,
    isHashrate7dVisible: boolean
}) {
    interface CleanWorkerHashrate {
        workername: string
        hashrate1m: number
        hashrate5m: number
        hashrate1h: number
        hashrate1d: number
        hashrate7d: number
        lastshare: string
        shares: number
        bestshare: number
        bestever: number
    }

    function normalizeHashrate(workers: Worker[]): CleanWorkerHashrate[] {
        return workers.map((worker) => {
            return {
                workername: worker.workername,
                lastshare: worker.lastshare,
                shares: worker.shares,
                bestshare: worker.bestshare,
                bestever: worker.bestever,
                hashrate1m: UnitConverter.fromStringToNumber(worker.hashrate1m),
                hashrate5m: UnitConverter.fromStringToNumber(worker.hashrate5m),
                hashrate1h: UnitConverter.fromStringToNumber(worker.hashrate1hr),
                hashrate1d: UnitConverter.fromStringToNumber(worker.hashrate1d),
                hashrate7d: UnitConverter.fromStringToNumber(worker.hashrate7d)
            }
        })
    }

    const [myTheme, setMyTheme] = useState(() =>
        themeQuartz.withPart(colorSchemeLight) // valeur par défaut (SSR)
    );

    useEffect(() => {
        const mq = globalThis.matchMedia("(prefers-color-scheme: dark)");
        const update = () =>
            setMyTheme(themeQuartz.withPart(mq.matches ? colorSchemeDark : colorSchemeLight));

        update(); // première évaluation
        mq.addEventListener("change", update); // mise à jour dynamique si l’utilisateur change le mode
        return () => mq.removeEventListener("change", update);
    }, []);

    const data = normalizeHashrate(workers);
    const columns = useMemo<ColDef<CleanWorkerHashrate>[]>(() => {
        const noData = "-";
        const cols: ColDef<CleanWorkerHashrate>[] = [{
            headerName: "Nom",
            field: "workername",
            colId: "workername",
            filter: true,
            valueFormatter: (params: ValueFormatterParams) => params.value?.split(".")[1],
        }]
        if (isHashrate1mVisible) cols.push(
            {
                headerName: "Hashrate (1m)",
                field: "hashrate1m",
                colId: "hashrate1m",
                filter: false,
                // valueFormatter: (params: ValueFormatterParams) => {
                //     if (!params.value) return noData;
                //     return UnitConverter.fromNumberToString(params.value);
                // },
                cellRenderer: (params: CustomCellRendererProps) => (
                    <HashrateCell
                        workerName={params.data.workername.split(".")[1]}
                        value={params.value}
                        period="30d"
                        hashrateKey="hashrate1m"
                    />
                ),
            }
        )

        if (isHashrate5mVisible) cols.push(
            {
                headerName: "Hashrate (5m)",
                field: "hashrate5m",
                colId: "hashrate5m",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
                cellRenderer: (params: CustomCellRendererProps) => (
                    <HashrateCell
                        workerName={params.data.workername.split(".")[1]}
                        value={params.value}
                        period="30d"
                        hashrateKey="hashrate5m"
                    />
                ),
            })
        if (isHashrate1hrVisible) cols.push(
            {
                headerName: "Hashrate (1h)",
                field: "hashrate1h",
                colId: "hashrate1h",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
                cellRenderer: (params: CustomCellRendererProps) => (
                    <HashrateCell
                        workerName={params.data.workername.split(".")[1]}
                        value={params.value}
                        period="30d"
                        hashrateKey="hashrate1h"
                    />
                ),
            }
        )
        if (isHashrate1dVisible) cols.push(
            {
                headerName: "Hashrate (1d)",
                field: "hashrate1d",
                colId: "hashrate1d",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
                cellRenderer: (params: CustomCellRendererProps) => (
                    <HashrateCell
                        workerName={params.data.workername.split(".")[1]}
                        value={params.value}
                        period="30d"
                        hashrateKey="hashrate1d"
                    />
                ),
            }
        )

        if (isHashrate7dVisible) cols.push(
            {
                headerName: "Hashrate (7d)",
                field: "hashrate7d",
                colId: "hashrate7d",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
                cellRenderer: (params: CustomCellRendererProps) => (
                    <HashrateCell
                        workerName={params.data.workername.split(".")[1]}
                        value={params.value}
                        period="30d"
                        hashrateKey="hashrate7d"
                    />
                ),
            }
        )

        cols.push(
            {
                headerName: "Last share",
                field: "lastshare",
                colId: "lastshare",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
            },
            {
                headerName: "Shares",
                field: "shares",
                colId: "shares",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
            },
            {
                headerName: "Best Share",
                field: "bestshare",
                colId: "bestshare",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
            },
            // {
            //     headerName: "Best Ever",
            //     field: "bestever",
            //     colId: "bestever",
            //     filter: false,
            //     valueFormatter: (params: ValueFormatterParams) => {
            //         if (!params.value) return noData;
            //         return UnitConverter.fromNumberToString(params.value);
            //     },
            // }
        )

        return cols.flat()
    }, [isHashrate1dVisible, isHashrate1hrVisible, isHashrate1mVisible, isHashrate5mVisible, isHashrate7dVisible]);
    return (
        <div id="workers-grid" className="ag-theme-quartz" style={{ flex: 1, minHeight: 0, minWidth: 0, height: "100%" }}>
            <AgGridReact
                theme={myTheme}
                rowData={data}
                columnDefs={columns}
                defaultColDef={{
                    minWidth: 80,
                    resizable: true,
                    flex: 1
                }}
                suppressMovableColumns={true}
                localeText={AG_GRID_LOCALE_FR}
                animateRows
                suppressColumnMoveAnimation={false}
                enableCellTextSelection
                rowSelection="multiple"
            />
        </div>
    );
}