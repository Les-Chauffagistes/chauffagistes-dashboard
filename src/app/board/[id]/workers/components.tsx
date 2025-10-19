import { AllCommunityModule, ColDef, ModuleRegistry, ValueFormatterParams, colorSchemeDark, colorSchemeLight, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Worker } from '../../../../../models/Worker';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import UnitConverter from '../../../../../lib/hashrateConverter';
import { AG_GRID_LOCALE_FR } from "@/../fr-FR";

ModuleRegistry.registerModules([AllCommunityModule]);

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void

export function ToolBar({
    hashrate1mHandler,
    hashrate5mHandler,
    hashrate1hrHandler,
    hashrate1dHandler,
    hashrate7dHandler,
    hashrate1m,
    hashrate5m,
    hashrate1hr,
    hashrate1d,
    hashrate7d
}: {
    hashrate1mHandler: ChangeHandler,
    hashrate5mHandler: ChangeHandler,
    hashrate1hrHandler: ChangeHandler,
    hashrate1dHandler: ChangeHandler,
    hashrate7dHandler: ChangeHandler,
    hashrate1m: boolean,
    hashrate5m: boolean,
    hashrate1hr: boolean,
    hashrate1d: boolean,
    hashrate7d: boolean
}) {
    return <div style={{ display: "flex", gap: 15, margin: "10px" }}>
        <p>Hashrate: </p>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <input type="checkbox" onChange={(e) => hashrate1mHandler(e)} checked={hashrate1m} />
            <label htmlFor="hashrate1m">1 min</label>
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <input type="checkbox" onChange={(e) => hashrate5mHandler(e)} checked={hashrate5m} />
            <label htmlFor="hashrate5m">5 min</label>
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <input type="checkbox" onChange={(e) => hashrate1hrHandler(e)} checked={hashrate1hr} />
            <label htmlFor="hashrate1hr">1 hr</label>
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <input type="checkbox" onChange={(e) => hashrate1dHandler(e)} checked={hashrate1d} />
            <label htmlFor="hashrate1d">1 day</label>
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <input type="checkbox" onChange={(e) => hashrate7dHandler(e)} checked={hashrate7d} />
            <label htmlFor="hashrate7d">7 days</label>
        </div>
    </div>
}

export function MainGrid({ workers, hashrate1m, hashrate5m, hashrate1hr, hashrate1d, hashrate7d }: { workers: Worker[], hashrate1m: boolean, hashrate5m: boolean, hashrate1hr: boolean, hashrate1d: boolean, hashrate7d: boolean }) {
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
        if (hashrate1m) cols.push(
            {
                headerName: "Hashrate (1m)",
                field: "hashrate1m",
                colId: "hashrate1m",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
            }
        )

        if (hashrate5m) cols.push(
            {
                headerName: "Hashrate (5m)",
                field: "hashrate5m",
                colId: "hashrate5m",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
            })
        if (hashrate1hr) cols.push(
            {
                headerName: "Hashrate (1h)",
                field: "hashrate1h",
                colId: "hashrate1h",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
            }
        )
        if (hashrate1d) cols.push(
            {
                headerName: "Hashrate (1d)",
                field: "hashrate1d",
                colId: "hashrate1d",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
            }
        )

        if (hashrate7d) cols.push(
            {
                headerName: "Hashrate (7d)",
                field: "hashrate7d",
                colId: "hashrate7d",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
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
            {
                headerName: "Best Ever",
                field: "bestever",
                colId: "bestever",
                filter: false,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (!params.value) return noData;
                    return UnitConverter.fromNumberToString(params.value);
                },
            }
        )

        return cols.flat()
    }, [hashrate1d, hashrate1hr, hashrate1m, hashrate5m, hashrate7d]);
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