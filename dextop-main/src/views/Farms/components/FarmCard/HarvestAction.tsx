import { Button, Flex, Heading } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'

import { ChainId } from '@pancakeswap/sdk'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import useHarvestFarm from '../../hooks/useHarvestFarm'
import { getLanguageCodeFromLS } from 'contexts/Localization/helpers'

const codeFromStorage = getLanguageCodeFromLS()
interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
}

export const getNumberForMobile = (number) => {
  return new Intl.NumberFormat(codeFromStorage, {
    notation: 'compact',
    compactDisplay: 'long',
    maximumSignificantDigits: 2,
  }).format(number)
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid }) => {
  const { account } = useWeb3React()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { t } = useTranslation()
  const { onReward } = useHarvestFarm(pid)
  const cakePrice = usePriceCakeBusd()
  const dispatch = useAppDispatch()
  const rawEarningsBalance = account ? getBalanceAmount(earnings, 9) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(cakePrice).toNumber() : 0

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      {(pid === 0 || pid === 1) && (
        <>
          <Flex flexDirection="column" alignItems="flex-start">
            <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>
              {getNumberForMobile(displayBalance)}
            </Heading>
            {earningsBusd > 0 && (
              <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
            )}
          </Flex>
          <Button
            disabled={rawEarningsBalance.eq(0) || pendingTx}
            onClick={async () => {
              const receipt = await fetchWithCatchTxError(() => {
                return onReward()
              })
              if (receipt?.status) {
                toastSuccess(
                  `${t('Harvested')}!`,
                  <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'DEX' })}
                  </ToastDescriptionWithTx>,
                )
                dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId: ChainId.PULSE_CHAIN }))
              }
            }}
          >
            {pendingTx ? t('Harvesting') : t('Harvest')}
          </Button>
        </>
      )}
    </Flex>
  )
}

export default HarvestAction
