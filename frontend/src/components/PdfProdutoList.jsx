import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';

import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import styles from './pdf-css';

const PdfProdutoList = ({ produtos }) => {
    const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });

    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.header}>Relatório de Produtos</Text>
                <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                    Gerado em: {currentDate}
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableHeader, { width: '10%' }]}>ID</Text>
                        <Text style={[styles.tableHeader, { width: '30%' }]}>Nome</Text>
                        <Text style={[styles.tableHeader, { width: '20%' }]}>Valor</Text>
                        <Text style={[styles.tableHeader, { width: '20%' }]}>Foto</Text>
                        <Text style={[styles.tableHeader, { width: '20%' }]}>Descrição</Text>
                    </View>
                    {produtos.map((produto) => (
                        <View key={produto.id_produto} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{produto.id_produto}</Text>
                            <Text style={[styles.tableCell, { width: '30%' }]}>{produto.nome}</Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>
                                {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                }).format(produto.valor_unitario)}
                            </Text>
                            <Image
                                style={[styles.tableCell, styles.image, { width: '20%' }]}
                                src={produto.foto}
                            />
                            <Text style={[styles.tableCell, { width: '20%' }]}>{produto.descricao}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default PdfProdutoList;
