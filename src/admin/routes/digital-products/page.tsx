import { defineRouteConfig } from "@medusajs/admin-sdk";
import { PhotoSolid } from "@medusajs/icons";
import { Container, Heading, Table, Button, Drawer } from "@medusajs/ui";
import {   useMemo, useState } from "react";
import { Link } from "react-router-dom"; 
import CreateDigitalProductForm from "../../components/create-digital-product-form";
import DeleteDigitalProduct from "../../components/delete-digital-product";
import {  useQueryClient } from "@tanstack/react-query";
 import {  useDigitalProducts } from "../../components/lib/digital-products";
 

const DigitalProductsPage = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageLimit = 20;

  const query = new URLSearchParams({
    limit: `${pageLimit}`,
    offset: `${pageLimit * currentPage}`,
  });

  const { data, isLoading } = useDigitalProducts(query);

  const pagesCount = useMemo(() => {
    return Math.ceil((data?.count || 0) / pageLimit);
  }, [data?.count]);

  const canNextPage = currentPage < pagesCount - 1;
  const canPreviousPage = currentPage > 0;

  const nextPage = () => {
    if (canNextPage) setCurrentPage((prev) => prev + 1);
  };

  const previousPage = () => {
    if (canPreviousPage) setCurrentPage((prev) => prev - 1);
  };

  const queryClient = useQueryClient();

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Digital Products</Heading>
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Trigger asChild>
            <Button onClick={() => setOpen(true)}>Create</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Create Product</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <CreateDigitalProductForm
                onSuccess={() => {
                  setOpen(false);
                  queryClient.invalidateQueries({ queryKey: ["products"] });
                }}
              />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>

      {isLoading ? (
        <div className="flex justify-center">Loading...</div>
      ) : data?.digital_products.length ? (
        <>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Overview</Table.HeaderCell>
                <Table.HeaderCell>Related variant</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.digital_products.map((digitalProduct) => (
                <Table.Row key={digitalProduct.id}>
                  <Table.Cell>{digitalProduct.name}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/digital-products/${digitalProduct.id}`}>
                      Product Overview
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/products/${digitalProduct.product_variant?.product_id}/variants/${digitalProduct.product_variant?.id}`}>
                      Related variant
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <DeleteDigitalProduct digitalProduct={digitalProduct} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Table.Pagination
            count={data.count || 0}
            pageSize={pageLimit}
            pageIndex={currentPage}
            pageCount={pagesCount}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            previousPage={previousPage}
            nextPage={nextPage}
          />
        </>
      ) : (
        <div className="text-center py-4">No digital products found.</div>
      )}
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Digital Products",
  icon: PhotoSolid,
});

export default DigitalProductsPage;
