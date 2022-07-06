import * as React from "react";
import { ShimmeredDetailsList, IDetailsListProps, PrimaryButton, Label } from "@fluentui/react";
import { IPagedDataProvider } from "mgwdev-m365-helpers";

export interface IPaginatedViewProps {
    dataProvider: IPagedDataProvider<any>;
    query?: string;
}

export function PaginatedView(props: IPaginatedViewProps & Partial<IDetailsListProps>) {
    const [currentItems, setCurrentItems] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        props.dataProvider.setQuery(props.query || "*");
        props.dataProvider.getData().then(data => {
            data.forEach(el => {
                el.id = el.fields.id;
                el.title = el.fields.title;
                delete el.fields;
            })
            setCurrentItems(data);
            setLoading(false);
        });
    }, [props.query]);

    const loadNextPage = async () => {
        setLoading(true);
        await props.dataProvider.getNextPage().then(data => setCurrentItems(data));
        setLoading(false);
    }
    const loadPrevPage = async () => {
        setLoading(true);
        await props.dataProvider.getPreviousPage().then(data => setCurrentItems(data));
        setLoading(false);
    }

    const renderFooter = () => {
        return <div>
            <PrimaryButton text="Previous" onClick={loadPrevPage} disabled={!props.dataProvider.isPreviousPageAvailable()} />
            <PrimaryButton text="Next" onClick={loadNextPage} disabled={!props.dataProvider.isNextPageAvailable()} />
        </div>
    }
    return <div>
        {props.dataProvider.allItemsCount >= 0 && <Label>Total: {props.dataProvider.allItemsCount}</Label>}
        <ShimmeredDetailsList
            setKey="items"
            items={currentItems || []}
            onRenderDetailsFooter={renderFooter}
            enableShimmer={loading}
        />
    </div>
}