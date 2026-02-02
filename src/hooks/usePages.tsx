import { useState, useCallback } from "react";

export interface Page {
  id: string;
  lessor_id: string;
  slug: string;
  title: string;
  meta_description: string;
  is_published: boolean;
  blocks: PageBlock[];
  created_at: string;
  updated_at: string;
}

export interface PageBlock {
  id: string;
  page_id: string;
  block_type: string;
  position: number;
  config: Record<string, any>;
}

// Mock data for testing
const MOCK_PAGES: Page[] = [
  {
    id: "page-1",
    lessor_id: "lessor-1",
    slug: "home",
    title: "Home",
    meta_description: "Welcome to our car rental",
    is_published: false,
    blocks: [
      {
        id: "block-1",
        page_id: "page-1",
        block_type: "hero",
        position: 0,
        config: {
          headline: "Welcome to Car Rental",
          subheadline: "Book your perfect vehicle today",
          cta_text: "Book Now",
          cta_link: "#booking",
          bg_color: "#ffffff",
        },
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function usePages(lessorId?: string) {
  const [pages, setPages] = useState<Page[]>(MOCK_PAGES);
  const [loading, setLoading] = useState(false);

  const getPages = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 500));
    return pages.filter((p) => !lessorId || p.lessor_id === lessorId);
  }, [pages, lessorId]);

  const getPageById = useCallback(
    async (pageId: string) => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 300));
      return pages.find((p) => p.id === pageId) || null;
    },
    [pages]
  );

  const createPage = useCallback(
    async (
      lessor_id: string,
      title: string,
      slug: string,
      meta_description: string = ""
    ): Promise<Page> => {
      const newPage: Page = {
        id: `page-${Date.now()}`,
        lessor_id,
        slug,
        title,
        meta_description,
        is_published: false,
        blocks: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setPages([...pages, newPage]);
      return newPage;
    },
    [pages]
  );

  const updatePage = useCallback(
    async (pageId: string, updates: Partial<Page>) => {
      setPages(
        pages.map((p) =>
          p.id === pageId
            ? { ...p, ...updates, updated_at: new Date().toISOString() }
            : p
        )
      );
    },
    [pages]
  );

  const deletePage = useCallback(
    async (pageId: string) => {
      setPages(pages.filter((p) => p.id !== pageId));
    },
    [pages]
  );

  const publishPage = useCallback(
    async (pageId: string) => {
      setPages(
        pages.map((p) =>
          p.id === pageId
            ? {
                ...p,
                is_published: true,
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : p
        )
      );
    },
    [pages]
  );

  const addBlock = useCallback(
    async (
      pageId: string,
      block_type: string,
      position: number,
      config: Record<string, any>
    ): Promise<PageBlock> => {
      const newBlock: PageBlock = {
        id: `block-${Date.now()}`,
        page_id: pageId,
        block_type,
        position,
        config,
      };

      setPages(
        pages.map((p) =>
          p.id === pageId ? { ...p, blocks: [...p.blocks, newBlock] } : p
        )
      );

      return newBlock;
    },
    [pages]
  );

  const updateBlock = useCallback(
    async (pageId: string, blockId: string, updates: Partial<PageBlock>) => {
      setPages(
        pages.map((p) =>
          p.id === pageId
            ? {
                ...p,
                blocks: p.blocks.map((b) =>
                  b.id === blockId ? { ...b, ...updates } : b
                ),
              }
            : p
        )
      );
    },
    [pages]
  );

  const deleteBlock = useCallback(
    async (pageId: string, blockId: string) => {
      setPages(
        pages.map((p) =>
          p.id === pageId
            ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId) }
            : p
        )
      );
    },
    [pages]
  );

  return {
    pages,
    loading,
    getPages,
    getPageById,
    createPage,
    updatePage,
    deletePage,
    publishPage,
    addBlock,
    updateBlock,
    deleteBlock,
  };
}
