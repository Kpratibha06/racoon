import * as RadioGroup from '@radix-ui/react-radio-group'

import { Bullet, BulletList } from './components/bullet-list'
import { Button, Heading, InputField, Space, mq } from 'ui'
import { EntryPoint, EntryPointField, LocaleField, PersonalNumberField } from './shared'
import type { GetStaticProps, NextPage } from 'next'

import { HeroImage } from '@/components/hero-image'
import { LoadingState } from './components/loading-state'
import { PageHeaderLayout } from '@/components/page-header-layout'
import { RadioGroupItem } from './components/radio-group-item'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import styled from '@emotion/styled'
import { useCurrentLocale } from '@/lib/l10n'
import { useForm } from '@/hooks/use-form'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

const Grid = styled.div({
  [mq.lg]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    height: '100vh',
  },
})

const Col = styled.div({
  [mq.lg]: {
    gridColumn: '2',
    width: '50vw',
    overflow: 'auto',
  },
})

const Content = styled(Space)({
  padding: '1rem',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  boxSizing: 'border-box',

  [mq.md]: {
    minHeight: 'initial',
    padding: '2rem 1rem',
  },

  [mq.lg]: {
    padding: '2rem',
  },

  [mq.xl]: {
    paddingTop: '6rem',
  },
})

const Text = styled.p(({ theme }) => ({
  lineHeight: '1.5rem',
  fontSize: '1rem',
  color: theme.colors.gray700,
  margin: 0,
}))

const HighlightBlock = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.gray200,
  padding: '1rem',
  borderRadius: '0.25rem',
}))

const CaptionLink = styled.a(({ theme }) => ({
  fontFamily: theme.fonts.body,
  color: theme.colors.gray500,
  textDecoration: 'underline',
  cursor: 'pointer',
}))

const StickyFooter = styled.div(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: theme.colors.white,
  boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.05), 0px -8px 16px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  justifyContent: 'stretch',

  [mq.lg]: {
    width: '50vw',
  },
}))

const FooterContent = styled.div({
  width: '100%',
  maxWidth: '600px',
  margin: 'auto',
  padding: '1rem',
  paddingBottom: '2rem',

  [mq.lg]: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
})

const Spacer = styled.div({
  height: '6rem',
})

const Overlay = styled.div<{ visible: boolean }>(({ theme, visible }) => ({
  position: 'fixed',
  zIndex: 9999,
  inset: 0,
  display: visible ? 'block' : 'none',
}))

const NewMemberStartPage: NextPage = () => {
  const { path } = useCurrentLocale()
  const form = useForm({ action: '/api/pages/start' })
  const [entryPoint, setEntryPoint] = useState(EntryPoint.Current)
  const { t } = useTranslation()

  const personalNumberError = form.errors?.[PersonalNumberField]

  return (
    <>
      <PageHeaderLayout headerVariant="light">
        <form {...form.formProps}>
          <Grid>
            <HeroImage
              mobileImgSrc="/racoon-assets/hero_start_mobile.jpg"
              desktopImgSrc="/racoon-assets/hero_start_desktop.jpg"
            />
            <Col>
              <Content y={1}>
                <Heading variant="s" headingLevel="h1" colorVariant="dark">
                  Få prisförslag, jämför och försäkring hos Hedvig direkt
                </Heading>
                <Text>Få prisförslag</Text>

                <RadioGroup.Root
                  name={EntryPointField}
                  value={entryPoint}
                  onValueChange={(value) => setEntryPoint(value as EntryPoint)}
                >
                  <Space y={0.5}>
                    <RadioGroupItem
                      value={EntryPoint.Current}
                      checked={entryPoint === EntryPoint.Current}
                      title="Där jag bor idag"
                      description="Få prisförslag på din nuvarande adress"
                    >
                      <InputField
                        label="Personnummer"
                        placeholder="YYMMDDXXXX"
                        inputMode="numeric"
                        required
                        name={PersonalNumberField}
                        onKeyDown={(event) => event.key === 'Enter' && form.submitForm()}
                        // https://github.com/personnummer/js
                        pattern="^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([+-]?)((?!000)\d{3})(\d)$"
                        errorMessage={personalNumberError && t(personalNumberError)}
                      />

                      <CaptionLink href="https://www.hedvig.com/se/personuppgifter">
                        Så hanterar vi dina personuppgifter
                      </CaptionLink>
                    </RadioGroupItem>

                    <RadioGroupItem
                      value={EntryPoint.New}
                      checked={entryPoint === EntryPoint.New}
                      title="Dit jag ska flytta"
                      description="Teckna en ny försäkring för en ny adress"
                    />

                    <RadioGroupItem
                      value={EntryPoint.Switch}
                      checked={entryPoint === EntryPoint.Switch}
                      title="Jämför pris och byt"
                      description="Jämför ditt nuvarande pris"
                    >
                      <HighlightBlock>
                        <BulletList y={0.75}>
                          <Bullet>Vi avslutar din nuvarande försäkring</Bullet>
                          <Bullet>Vi försöker alltid ge dig ett bra pris</Bullet>
                          <Bullet>Vi sköter hela bytet åt dig</Bullet>
                        </BulletList>
                      </HighlightBlock>
                    </RadioGroupItem>
                  </Space>
                </RadioGroup.Root>
              </Content>

              <Spacer />

              <StickyFooter>
                <FooterContent>
                  <input hidden readOnly name={LocaleField} value={path} />
                  <Button style={{ width: '100%' }}>Fortsätt</Button>
                </FooterContent>
              </StickyFooter>
            </Col>
          </Grid>
        </form>
      </PageHeaderLayout>

      <Overlay visible={form.state === 'submitting'}>
        <LoadingState />
      </Overlay>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string)
  return { props: { ...translations } }
}

export default NewMemberStartPage
