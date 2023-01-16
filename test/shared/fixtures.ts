import { expandTo18Decimals } from './utilities'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { UniswapV2Factory, UniswapV2Router02, DXswapFactory, DXswapFactory__factory, DXswapPair, DXswapPair__factory, DXswapRouter, DXswapRouter__factory, ERC20, ERC20__factory, TokenERC20__factory, WETH9, WETH9__factory, WXDAI, WXDAI__factory, Zap, Zap__factory, UniswapV2Pair, UniswapV2Pair__factory } from '../../typechain'
import { ethers } from 'hardhat'
import { Address } from 'hardhat-deploy/types'

interface DXswapFixture {
  zap: Zap
  dxswapRouter: DXswapRouter
  dxswapFactory: DXswapFactory
  dex2Router: DXswapRouter
  dex2Factory: DXswapFactory
  dex3Router: DXswapRouter
  dex3Factory: DXswapFactory  
  uniswapV2Factory: UniswapV2Factory
  uniswapV2Router: UniswapV2Router02
  WETH: WETH9
  WXDAI: WXDAI
  GNO: ERC20
  DXD: ERC20
  COW: ERC20
  SWPR: ERC20

  wethXdai: DXswapPair
  swprXdai: DXswapPair
  wethGno: DXswapPair
  gnoXdai: DXswapPair
  dxdWeth: DXswapPair
  cowWeth: DXswapPair
  gnoDxd: DXswapPair
  wethGnoDex3: DXswapPair
  wxdaiWeth: UniswapV2Pair

  FEE_TO_SETTER: Address
  }

  

export async function dxswapFixture(wallet: SignerWithAddress): Promise<DXswapFixture> {
  const overrides = {
    gasLimit: 9999999
  }

// GNOSIS CHAIN addresses 
const WETH_ADDRESS = "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1"
const WXDAI_ADDRESS = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"
const GNO_ADDRESS = "0x9c58bacc331c9aa871afd802db6379a98e80cedb"
const DXD_ADDRESS = "0xb90D6bec20993Be5d72A5ab353343f7a0281f158"
const COW_ADDRESS = "0x177127622c4A00F3d409B75571e12cB3c8973d3c"
const SWPR_ADDRESS = "0x532801ED6f82FFfD2DAB70A19fC2d7B2772C4f4b"
const FEE_TO_SETTER = "0xe3f8f55d7709770a18a30b7e0d16ae203a2c034f"

// dex: swapr
const SWPR_ROUTER_ADDRESS = "0xE43e60736b1cb4a75ad25240E2f9a62Bff65c0C0"
const SWPR_FACTORY_ADDRESS = "0x5D48C95AdfFD4B40c1AAADc4e08fc44117E02179"

const SWPR_WETH_XDAI = "0x1865d5445010e0baf8be2eb410d3eae4a68683c2"
const SWPR_SWPR_XDAI = "0xa82029c1E11eA0aC18dd3551c6E670787e12E45E"
const SWPR_WETH_GNO = "0x5fCA4cBdC182e40aeFBCb91AFBDE7AD8d3Dc18a8"
const SWPR_GNO_XDAI = "0xD7b118271B1B7d26C9e044Fc927CA31DccB22a5a"
const SWPR_DXD_WETH = "0x1bDe964eCd52429004CbC5812C07C28bEC9147e9"
const SWPR_GNO_DXD = "0x558d777b24366f011e35a9f59114d1b45110d67b"
const SWPR_COW_WETH = "0x8028457E452D7221dB69B1e0563AA600A059fab1"

// dex: levinswap
const DEX2_ROUTER_ADDRESS = "0xb18d4f69627F8320619A696202Ad2C430CeF7C53"
const DEX2_FACTORY_ADDRESS = "0x965769C9CeA8A7667246058504dcdcDb1E2975A5"

const UNISWAP_WXDAI_WETH = "0x2Eb71cD867E7E1d3A17eCD981d592e079B6Cb985";

// dex: honeyswap
const DEX3_ROUTER_ADDRESS = "0x1C232F01118CB8B424793ae03F870aa7D0ac7f77"
const DEX3_FACTORY_ADDRESS = "0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7"

const DEX3_WETH_GNO = "0x28Dbd35fD79f48bfA9444D330D14683e7101d817"


  // deploy tokens
  const erc20Factory = await ethers.getContractFactory("ERC20")
  const SWPR = erc20Factory.attach(SWPR_ADDRESS)
  const GNO = erc20Factory.attach(GNO_ADDRESS)
  const DXD = erc20Factory.attach(DXD_ADDRESS)
  const COW = erc20Factory.attach(COW_ADDRESS)

  const wethFactory = await ethers.getContractFactory("WETH9")
  const WETH = wethFactory.attach(WETH_ADDRESS)
  
  const wxdaiFactory = await ethers.getContractFactory("WXDAI")
  const WXDAI = wxdaiFactory.attach(WXDAI_ADDRESS)


  // deploy DXswapFactory
  const swapFactory = await ethers.getContractFactory("DXswapFactory")
  const dxswapFactory = swapFactory.attach(SWPR_FACTORY_ADDRESS)
  const dex2Factory = dxswapFactory.attach(DEX2_FACTORY_ADDRESS)
  const dex3Factory = swapFactory.attach(DEX3_FACTORY_ADDRESS)

  // DEX2 (aka: levinswap) is an ~unmodified Uniswap V2 fork
  const uniswapV2FactoryContract = await ethers.getContractFactory("UniswapV2Factory")
  const uniswapV2Factory = uniswapV2FactoryContract.attach(DEX2_FACTORY_ADDRESS)

  // deploy router  
  const routerFactory = await ethers.getContractFactory("DXswapRouter")
  const dxswapRouter = routerFactory.attach(SWPR_ROUTER_ADDRESS)
  const dex2Router = routerFactory.attach(DEX2_ROUTER_ADDRESS)
  const dex3Router = routerFactory.attach(DEX3_ROUTER_ADDRESS)

  // DEX2 (aka: levinswap) is an ~unmodified Uniswap V2 fork
  const uniswapV2RouterFactory = await ethers.getContractFactory("UniswapV2Router02")
  const uniswapV2Router = uniswapV2RouterFactory.attach(DEX2_ROUTER_ADDRESS)

  // initialize DXswapPair factory
  const dxSwapPair_factory = await ethers.getContractFactory("DXswapPair")

  // initialize UniswapV2Pair factory
  const uniswapV2Pair_factory = await ethers.getContractFactory("UniswapV2Pair")

  // create pairs SWPR
  const wethXdai = dxSwapPair_factory.attach(SWPR_WETH_XDAI)
  const wethGno = dxSwapPair_factory.attach(SWPR_WETH_GNO)
  const gnoXdai = dxSwapPair_factory.attach(SWPR_GNO_XDAI)
  const swprXdai = dxSwapPair_factory.attach(SWPR_SWPR_XDAI)
  const dxdWeth = dxSwapPair_factory.attach(SWPR_DXD_WETH)
  const cowWeth = dxSwapPair_factory.attach(SWPR_COW_WETH)
  const gnoDxd = dxSwapPair_factory.attach(SWPR_GNO_DXD)
  const wxdaiWeth = uniswapV2Pair_factory.attach(UNISWAP_WXDAI_WETH);

  // create pairs dex3
  const wethGnoDex3 = dxSwapPair_factory.attach(DEX3_WETH_GNO)
  
  // deploy Relayer and TradeRelayer
  const zap = await new Zap__factory(wallet).deploy(wallet.address, FEE_TO_SETTER, WXDAI_ADDRESS, overrides)
  
  return {
    zap,
    dxswapRouter,
    dxswapFactory,
    dex2Router,
    dex2Factory,
    dex3Router,
    dex3Factory, 
    uniswapV2Factory,
    uniswapV2Router,
    WETH,
    WXDAI,
    GNO,
    DXD,
    COW,
    SWPR,
    wethXdai,
    swprXdai,
    wethGno,
    gnoXdai,
    dxdWeth,
    cowWeth,
    gnoDxd,
    wethGnoDex3,
    wxdaiWeth,
    FEE_TO_SETTER
  }
}