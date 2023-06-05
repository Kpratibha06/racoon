import { type Meta, type StoryObj } from '@storybook/react'
import { ArticleCategoryList } from './ArticleCategoryList'

const meta: Meta = {
  title: 'Article Category List',
}

export default meta
type Story = StoryObj

export const Primary: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <ArticleCategoryList.Root>
        <ArticleCategoryList.Item href="/se">Alla artiklar</ArticleCategoryList.Item>
        <ArticleCategoryList.Item href="/" active={true}>
          Försäkringar
        </ArticleCategoryList.Item>
        <ArticleCategoryList.Item href="/">Insikter</ArticleCategoryList.Item>
        <ArticleCategoryList.Item href="/">På Hedvig</ArticleCategoryList.Item>
        <ArticleCategoryList.Item href="/">Lifestyle</ArticleCategoryList.Item>
        <ArticleCategoryList.Item href="/">Press</ArticleCategoryList.Item>
      </ArticleCategoryList.Root>
    </div>
  ),
}
