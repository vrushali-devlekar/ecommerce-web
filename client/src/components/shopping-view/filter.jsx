import { filterOptions as defaultFilterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter, filterOptions = defaultFilterOptions }) {
  return (
    <div className="bg-background rounded-none border-t border-border">
      <div className="p-4 py-6 border-b border-border">
        <h2 className="text-xl font-serif font-bold tracking-tight uppercase text-foreground">Filters</h2>
      </div>
      <div className="p-4 space-y-6">
        <div>
          <Label className="flex font-medium items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={filters?.inStock === true}
              onCheckedChange={(checked) => handleFilter("inStock", checked)}
              className="border-border rounded-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">Hide out of stock</span>
          </Label>
        </div>
        <Separator className="bg-border" />
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">{keyItem}</h3>
              <div className="grid gap-3">
                {filterOptions[keyItem].map((option) => (
                  <Label key={option.id} className="flex font-medium items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                      className="border-border rounded-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>
            <Separator className="bg-border" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
