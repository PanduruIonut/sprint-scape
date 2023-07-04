import { motion } from 'framer-motion';
import { Flex, Link, Center, Image } from '@chakra-ui/react';
import sprintIcn from '../../../public/icons/sprint.png';

const Navbar = () => {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                marginBottom: '20px',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                width: '100%',
                color: '#383838',
                fontSize: '15px',
            }}
        >
            <Center>
                <Flex as="header" align="center" justify="space-between" px={4} py={2}
                    backdropFilter={'blur(10px)'}
                    backgroundColor={'rgba(255, 255, 255, 0.5)'}
                    borderRadius={'8px'}
                    width={360}
                >
                    <Image
                        src={sprintIcn.src}
                        alt=''
                        boxSize="30px"
                        objectFit="cover"
                        onClick={() => { window.location.href = '/' }}
                    />
                    <Flex as="ul" listStyleType="none" align="center">
                        <motion.li whileHover={{ color: 'black' }} whileTap={{ scale: 0.9 }} style={{ marginRight: '6px' }}>
                            <Link style={{ textDecoration: 'none' }} href="/quick-play">QuickPlay</Link>
                        </motion.li>
                        <motion.li whileHover={{ color: 'black' }} whileTap={{ scale: 0.9 }} style={{ marginRight: '6px' }}>
                            <Link style={{ textDecoration: 'none' }} href="/collab">Collab</Link>
                        </motion.li>
                        <motion.li whileHover={{ color: 'black' }} whileTap={{ scale: 0.9 }} >
                            <Link style={{ textDecoration: 'none' }} href="/join">Join</Link>
                        </motion.li>
                    </Flex>
                </Flex>
            </Center>
        </motion.nav>
    );
};

export default Navbar;
