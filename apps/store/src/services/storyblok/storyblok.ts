import { apiPlugin, getStoryblokApi, SbBlokData, storyblokInit, StoryData } from '@storyblok/react'
import { AccordionBlock } from '@/blocks/AccordionBlock'
import { AccordionItemBlock } from '@/blocks/AccordionItemBlock'
import { ButtonBlock } from '@/blocks/ButtonBlock'
import { CheckListBlock } from '@/blocks/CheckListBlock'
import { ContactSupportBlock } from '@/blocks/ContactSupportBlock'
import { ContentBlock } from '@/blocks/ContentBlock'
import { HeadingBlock } from '@/blocks/HeadingBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import { ImageBlock } from '@/blocks/ImageBlock'
import { PageBlock } from '@/blocks/PageBlock'
import { PriceCalculatorBlock } from '@/blocks/PriceCalculatorBlock'
import { ProductCardBlock } from '@/blocks/ProductCardBlock'
import { ProductGridBlock } from '@/blocks/ProductGridBlock'
import { ProductSlideshowBlock } from '@/blocks/ProductSlideshowBlock'
import { ProductSummaryBlock } from '@/blocks/ProductSummaryBlock'
import { SpacerBlock } from '@/blocks/SpacerBlock'
import { TabsBlock } from '@/blocks/TabsBlock'
import { TextBlock } from '@/blocks/TextBlock'
import { NavItemBlock, NestedNavContainerBlock, TopMenuBlock } from '@/blocks/TopMenuBlock'
import { TopPickCardBlock } from '@/blocks/TopPickCardBlock'

export type SbBaseBlockProps<T> = {
  blok: SbBlokData & T
}

export type StoryblokQueryParams = {
  slug: string[]
}

export type StoryblokPageProps = {
  story: StoryData
  globalStory: StoryData | boolean
}

export type StoryblokImage = {
  alt: string
  copyright: string
  fieldtype: 'asset'
  filename: string
  focus: string
  id: number
  is_external_url: boolean
  name: string
  title: string
}

export type LinkField = {
  id: string
  url: string
  linktype: 'story' | 'url'
  cached_url: string // use this
}

export type ProductStory = StoryData & {
  content: StoryData['content'] & {
    name: string
    productId: string
    priceFormTemplateId: string
    body: Array<SbBlokData>
    global: Array<SbBlokData>
  }
}

type GlobalStory = StoryData

export enum StoryblokBlockName {
  Accordion = 'accordion',
  AccordionItem = 'accordionItem',
  Button = 'button',
  CheckList = 'checkList',
  ContactSupport = 'contactSupport',
  Content = 'content',
  Heading = 'heading',
  Hero = 'hero',
  Image = 'image',
  NavItemBlock = 'nav_item', // Used within TopMenu
  NestedNavContainerBlock = 'nested_nav_container', // Used within TopMenu
  Page = 'page',
  PriceCalculator = 'priceCalculator',
  Product = 'product',
  ProductCard = 'productCard',
  ProductGrid = 'productGrid',
  ProductSlideshow = 'productSlideshow',
  ProductSummary = 'productSummary',
  Spacer = 'spacer',
  Tab = 'tab',
  Tabs = 'tabs',
  Text = 'text',
  TopMenu = 'top_menu',
  TopPickCard = 'topPickCard',
}

export const initStoryblok = () => {
  const components = {
    [StoryblokBlockName.Accordion]: AccordionBlock,
    [StoryblokBlockName.AccordionItem]: AccordionItemBlock,
    [StoryblokBlockName.Button]: ButtonBlock,
    [StoryblokBlockName.CheckList]: CheckListBlock,
    [StoryblokBlockName.ContactSupport]: ContactSupportBlock,
    [StoryblokBlockName.Content]: ContentBlock,
    [StoryblokBlockName.Heading]: HeadingBlock,
    [StoryblokBlockName.Hero]: HeroBlock,
    [StoryblokBlockName.Image]: ImageBlock,
    [StoryblokBlockName.NavItemBlock]: NavItemBlock, // Used within TopMenu
    [StoryblokBlockName.NestedNavContainerBlock]: NestedNavContainerBlock, // Used within TopMenu
    [StoryblokBlockName.Page]: PageBlock,
    [StoryblokBlockName.PriceCalculator]: PriceCalculatorBlock,
    [StoryblokBlockName.Product]: PageBlock,
    [StoryblokBlockName.ProductCard]: ProductCardBlock,
    [StoryblokBlockName.ProductGrid]: ProductGridBlock,
    [StoryblokBlockName.ProductSlideshow]: ProductSlideshowBlock,
    [StoryblokBlockName.ProductSummary]: ProductSummaryBlock,
    [StoryblokBlockName.Spacer]: SpacerBlock,
    [StoryblokBlockName.Tabs]: TabsBlock,
    [StoryblokBlockName.Text]: TextBlock,
    [StoryblokBlockName.TopMenu]: TopMenuBlock,
    [StoryblokBlockName.TopPickCard]: TopPickCardBlock,
  }

  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    components,
  })
}

export const getStoryBySlug = async (slug: string, preview = false) => {
  const storyblokApi = getStoryblokApi()
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    version: preview ? 'draft' : 'published',
  })
  return data.story
}

export const getAllLinks = async () => {
  const storyblokApi = getStoryblokApi()
  const { data } = await storyblokApi.get('cdn/links/')
  return data.links
}

export const getGlobalStory = async (preview = false) => {
  try {
    const story = await getStoryBySlug('global', preview)
    return story as GlobalStory
  } catch {
    return null
  }
}

export const getProductStory = async (slug: string, preview = false) => {
  const story = await getStoryBySlug(`/products/${slug}`, preview)
  return story as ProductStory
}

export const getStoreStory = async (preview = false) => {
  const story = await getStoryBySlug('/store', preview)
  return story as StoryData
}
