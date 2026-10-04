var wms_layers = [];


        var lyr_GoogleSatelliteHybrid_0 = new ol.layer.Tile({
            'title': 'GoogleSatelliteHybrid',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            })
        });

        var lyr_GoogleTerrain_1 = new ol.layer.Tile({
            'title': 'Google Terrain',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
            })
        });

        var lyr_OpenStreetMap_2 = new ol.layer.Tile({
            'title': 'OpenStreetMap',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });

        var lyr_PetaDasarATRBPN_3 = new ol.layer.Tile({
            'title': 'Peta Dasar ATRBPN',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://petadasar.atrbpn.go.id/main/wms/{x}/{y}/{z}'
            })
        });
var format_RDTR_KOTA_RANTAUPRAPAT_4 = new ol.format.GeoJSON();
var features_RDTR_KOTA_RANTAUPRAPAT_4 = format_RDTR_KOTA_RANTAUPRAPAT_4.readFeatures(json_RDTR_KOTA_RANTAUPRAPAT_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_RDTR_KOTA_RANTAUPRAPAT_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_RDTR_KOTA_RANTAUPRAPAT_4.addFeatures(features_RDTR_KOTA_RANTAUPRAPAT_4);
var lyr_RDTR_KOTA_RANTAUPRAPAT_4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_RDTR_KOTA_RANTAUPRAPAT_4, 
                style: style_RDTR_KOTA_RANTAUPRAPAT_4,
                popuplayertitle: 'RDTR_KOTA_RANTAUPRAPAT',
                interactive: true,
    title: 'RDTR_KOTA_RANTAUPRAPAT<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_0.png" /> <br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_1.png" /> Badan Air<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_2.png" /> Badan Jalan<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_3.png" /> Jalur Hijau<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_4.png" /> Pariwisata<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_5.png" /> Pemakaman<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_6.png" /> Perdagangan dan Jasa Skala Kota<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_7.png" /> Perdagangan dan Jasa Skala SWP<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_8.png" /> Perdagangan dan Jasa Skala WP<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_9.png" /> Pergudangan<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_10.png" /> Perkantoran<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_11.png" /> Perkebunan<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_12.png" /> Perlindungan Setempat<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_13.png" /> Pertahanan dan Keamanan<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_14.png" /> Perumahan Kepadatan Rendah<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_15.png" /> Perumahan Kepadatan Sedang<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_16.png" /> Perumahan Kepadatan Tinggi<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_17.png" /> Rimba Kota<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_18.png" /> SPU Skala Kecamatan<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_19.png" /> SPU Skala Kelurahan<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_20.png" /> SPU Skala Kota<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_21.png" /> Taman Kecamatan<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_22.png" /> Taman Kelurahan<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_23.png" /> Taman Kota<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_24.png" /> Tanaman Pangan<br />\
    <img src="styles/legend/RDTR_KOTA_RANTAUPRAPAT_4_25.png" /> Transportasi<br />' });
var format_LP2BLabuhanbatuUtara2023_5 = new ol.format.GeoJSON();
var features_LP2BLabuhanbatuUtara2023_5 = format_LP2BLabuhanbatuUtara2023_5.readFeatures(json_LP2BLabuhanbatuUtara2023_5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_LP2BLabuhanbatuUtara2023_5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_LP2BLabuhanbatuUtara2023_5.addFeatures(features_LP2BLabuhanbatuUtara2023_5);
var lyr_LP2BLabuhanbatuUtara2023_5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_LP2BLabuhanbatuUtara2023_5, 
                style: style_LP2BLabuhanbatuUtara2023_5,
                popuplayertitle: 'LP2B Labuhanbatu Utara 2023',
                interactive: true,
                title: '<img src="styles/legend/LP2BLabuhanbatuUtara2023_5.png" /> LP2B Labuhanbatu Utara 2023'
            });
var format_LP2BLabuhanbatu2023_6 = new ol.format.GeoJSON();
var features_LP2BLabuhanbatu2023_6 = format_LP2BLabuhanbatu2023_6.readFeatures(json_LP2BLabuhanbatu2023_6, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_LP2BLabuhanbatu2023_6 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_LP2BLabuhanbatu2023_6.addFeatures(features_LP2BLabuhanbatu2023_6);
var lyr_LP2BLabuhanbatu2023_6 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_LP2BLabuhanbatu2023_6, 
                style: style_LP2BLabuhanbatu2023_6,
                popuplayertitle: 'LP2B Labuhanbatu 2023',
                interactive: true,
                title: '<img src="styles/legend/LP2BLabuhanbatu2023_6.png" /> LP2B Labuhanbatu 2023'
            });
var format_RTRWLABUHANBATUNo3Tahun2016_7 = new ol.format.GeoJSON();
var features_RTRWLABUHANBATUNo3Tahun2016_7 = format_RTRWLABUHANBATUNo3Tahun2016_7.readFeatures(json_RTRWLABUHANBATUNo3Tahun2016_7, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_RTRWLABUHANBATUNo3Tahun2016_7 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_RTRWLABUHANBATUNo3Tahun2016_7.addFeatures(features_RTRWLABUHANBATUNo3Tahun2016_7);
var lyr_RTRWLABUHANBATUNo3Tahun2016_7 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_RTRWLABUHANBATUNo3Tahun2016_7, 
                style: style_RTRWLABUHANBATUNo3Tahun2016_7,
                popuplayertitle: 'RTRW LABUHANBATU No 3 Tahun 2016',
                interactive: true,
    title: 'RTRW LABUHANBATU No 3 Tahun 2016<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_0.png" /> Bandar Udara<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_1.png" /> HL<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_2.png" /> HP<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_3.png" /> Hutan Mangrove<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_4.png" /> Kawasan Industri<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_5.png" /> Perkebunan<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_6.png" /> Permukiman Pedesaan<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_7.png" /> Permukiman Perkotaan<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_8.png" /> Pertanian Lahan Basah<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_9.png" /> Pertanian Lahan Kering<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_10.png" /> Resapan Air<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_11.png" /> Sempadan Pantai<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_12.png" /> Sempadan Sungai<br />\
    <img src="styles/legend/RTRWLABUHANBATUNo3Tahun2016_7_13.png" /> <br />' });
var format_RTRWLABUHANBATUUTARANo5Tahun2015_8 = new ol.format.GeoJSON();
var features_RTRWLABUHANBATUUTARANo5Tahun2015_8 = format_RTRWLABUHANBATUUTARANo5Tahun2015_8.readFeatures(json_RTRWLABUHANBATUUTARANo5Tahun2015_8, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_RTRWLABUHANBATUUTARANo5Tahun2015_8 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_RTRWLABUHANBATUUTARANo5Tahun2015_8.addFeatures(features_RTRWLABUHANBATUUTARANo5Tahun2015_8);
var lyr_RTRWLABUHANBATUUTARANo5Tahun2015_8 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_RTRWLABUHANBATUUTARANo5Tahun2015_8, 
                style: style_RTRWLABUHANBATUUTARANo5Tahun2015_8,
                popuplayertitle: 'RTRW LABUHANBATU UTARA No 5 Tahun 2015',
                interactive: true,
    title: 'RTRW LABUHANBATU UTARA No 5 Tahun 2015<br />\
    <img src="styles/legend/RTRWLABUHANBATUUTARANo5Tahun2015_8_0.png" /> Badan Air<br />\
    <img src="styles/legend/RTRWLABUHANBATUUTARANo5Tahun2015_8_1.png" /> Hutan Lindung<br />\
    <img src="styles/legend/RTRWLABUHANBATUUTARANo5Tahun2015_8_2.png" /> Hutan Produksi<br />\
    <img src="styles/legend/RTRWLABUHANBATUUTARANo5Tahun2015_8_3.png" /> Hutan Produksi Konversi<br />\
    <img src="styles/legend/RTRWLABUHANBATUUTARANo5Tahun2015_8_4.png" /> Hutan Produksi Terbatas<br />\
    <img src="styles/legend/RTRWLABUHANBATUUTARANo5Tahun2015_8_5.png" /> Hutan Suaka Alam<br />\
    <img src="styles/legend/RTRWLABUHANBATUUTARANo5Tahun2015_8_6.png" /> Perkebunan<br />\
    <img src="styles/legend/RTRWLABUHANBATUUTARANo5Tahun2015_8_7.png" /> Permukiman<br />\
    <img src="styles/legend/RTRWLABUHANBATUUTARANo5Tahun2015_8_8.png" /> Pertanian Lahan Basah<br />\
    <img src="styles/legend/RTRWLABUHANBATUUTARANo5Tahun2015_8_9.png" /> Pertanian Lahan Kering<br />\
    <img src="styles/legend/RTRWLABUHANBATUUTARANo5Tahun2015_8_10.png" /> <br />' });
var format_KawasanHutanSK6609_9 = new ol.format.GeoJSON();
var features_KawasanHutanSK6609_9 = format_KawasanHutanSK6609_9.readFeatures(json_KawasanHutanSK6609_9, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_KawasanHutanSK6609_9 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_KawasanHutanSK6609_9.addFeatures(features_KawasanHutanSK6609_9);
var lyr_KawasanHutanSK6609_9 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_KawasanHutanSK6609_9, 
                style: style_KawasanHutanSK6609_9,
                popuplayertitle: 'Kawasan Hutan SK.6609',
                interactive: true,
    title: 'Kawasan Hutan SK.6609<br />\
    <img src="styles/legend/KawasanHutanSK6609_9_0.png" /> HL<br />\
    <img src="styles/legend/KawasanHutanSK6609_9_1.png" /> HP<br />\
    <img src="styles/legend/KawasanHutanSK6609_9_2.png" /> HPK<br />\
    <img src="styles/legend/KawasanHutanSK6609_9_3.png" /> HPT<br />\
    <img src="styles/legend/KawasanHutanSK6609_9_4.png" /> KSA/KPA<br />\
    <img src="styles/legend/KawasanHutanSK6609_9_5.png" /> Tubuh Air<br />\
    <img src="styles/legend/KawasanHutanSK6609_9_6.png" /> <br />' });
var format_PIPPIB2025_10 = new ol.format.GeoJSON();
var features_PIPPIB2025_10 = format_PIPPIB2025_10.readFeatures(json_PIPPIB2025_10, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_PIPPIB2025_10 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_PIPPIB2025_10.addFeatures(features_PIPPIB2025_10);
var lyr_PIPPIB2025_10 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_PIPPIB2025_10, 
                style: style_PIPPIB2025_10,
                popuplayertitle: 'PIPPIB 2025',
                interactive: true,
                title: '<img src="styles/legend/PIPPIB2025_10.png" /> PIPPIB 2025'
            });
var format_Komoditas_11 = new ol.format.GeoJSON();
var features_Komoditas_11 = format_Komoditas_11.readFeatures(json_Komoditas_11, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Komoditas_11 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Komoditas_11.addFeatures(features_Komoditas_11);
var lyr_Komoditas_11 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Komoditas_11, 
                style: style_Komoditas_11,
                popuplayertitle: 'Komoditas',
                interactive: true,
    title: 'Komoditas<br />\
    <img src="styles/legend/Komoditas_11_0.png" /> Karet<br />\
    <img src="styles/legend/Komoditas_11_1.png" /> Kelapa Sawit<br />\
    <img src="styles/legend/Komoditas_11_2.png" /> <br />' });
var format_Batas_Administrasi_12 = new ol.format.GeoJSON();
var features_Batas_Administrasi_12 = format_Batas_Administrasi_12.readFeatures(json_Batas_Administrasi_12, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Batas_Administrasi_12 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Batas_Administrasi_12.addFeatures(features_Batas_Administrasi_12);
var lyr_Batas_Administrasi_12 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Batas_Administrasi_12, 
                style: style_Batas_Administrasi_12,
                popuplayertitle: 'Batas_Administrasi',
                interactive: true,
                title: '<img src="styles/legend/Batas_Administrasi_12.png" /> Batas_Administrasi'
            });
var format_HGU_13 = new ol.format.GeoJSON();
var features_HGU_13 = format_HGU_13.readFeatures(json_HGU_13, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_HGU_13 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_HGU_13.addFeatures(features_HGU_13);
var lyr_HGU_13 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_HGU_13, 
                style: style_HGU_13,
                popuplayertitle: 'HGU',
                interactive: true,
    title: 'HGU<br />\
    <img src="styles/legend/HGU_13_0.png" /> Badan Usaha Milik Negara (BUMN)<br />\
    <img src="styles/legend/HGU_13_1.png" /> Badan Usaha Milik Swasta (BUMS)<br />' });
var format_PETA_14 = new ol.format.GeoJSON();
var features_PETA_14 = format_PETA_14.readFeatures(json_PETA_14, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_PETA_14 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_PETA_14.addFeatures(features_PETA_14);
cluster_PETA_14 = new ol.source.Cluster({
  distance: 30,
  source: jsonSource_PETA_14
});
var lyr_PETA_14 = new ol.layer.Vector({
                declutter: false,
                source:cluster_PETA_14, 
                style: style_PETA_14,
                popuplayertitle: 'PETA',
                interactive: true,
                title: '<img src="styles/legend/PETA_14.png" /> PETA'
            });
var group_PetaLain = new ol.layer.Group({
                                layers: [lyr_RDTR_KOTA_RANTAUPRAPAT_4,lyr_LP2BLabuhanbatuUtara2023_5,lyr_LP2BLabuhanbatu2023_6,lyr_RTRWLABUHANBATUNo3Tahun2016_7,lyr_RTRWLABUHANBATUUTARANo5Tahun2015_8,lyr_KawasanHutanSK6609_9,lyr_PIPPIB2025_10,lyr_Komoditas_11,],
                                fold: 'close',
                                title: 'Peta Lain'});
var group_BaseMaps = new ol.layer.Group({
                                layers: [lyr_GoogleSatelliteHybrid_0,lyr_GoogleTerrain_1,lyr_OpenStreetMap_2,lyr_PetaDasarATRBPN_3,],
                                fold: 'close',
                                title: 'Base Maps'});

lyr_GoogleSatelliteHybrid_0.setVisible(true);lyr_GoogleTerrain_1.setVisible(false);lyr_OpenStreetMap_2.setVisible(false);lyr_PetaDasarATRBPN_3.setVisible(false);lyr_RDTR_KOTA_RANTAUPRAPAT_4.setVisible(false);lyr_LP2BLabuhanbatuUtara2023_5.setVisible(false);lyr_LP2BLabuhanbatu2023_6.setVisible(false);lyr_RTRWLABUHANBATUNo3Tahun2016_7.setVisible(false);lyr_RTRWLABUHANBATUUTARANo5Tahun2015_8.setVisible(false);lyr_KawasanHutanSK6609_9.setVisible(false);lyr_PIPPIB2025_10.setVisible(false);lyr_Komoditas_11.setVisible(false);lyr_Batas_Administrasi_12.setVisible(true);lyr_HGU_13.setVisible(true);lyr_PETA_14.setVisible(true);
var layersList = [group_BaseMaps,group_PetaLain,lyr_Batas_Administrasi_12,lyr_HGU_13,lyr_PETA_14];
lyr_RDTR_KOTA_RANTAUPRAPAT_4.set('fieldAliases', {'NAMOBJ': 'NAMOBJ', 'NAMZON': 'NAMZON', 'KODZON': 'KODZON', 'NAMSZN': 'NAMSZN', 'KODSZN': 'KODSZN', 'JNSRPR': 'JNSRPR', 'KODEWP': 'KODEWP', 'KODSWP': 'KODSWP', 'KODBLK': 'KODBLK', 'KODSBL': 'KODSBL', 'WADMPR': 'WADMPR', 'WADMKK': 'WADMKK', 'WADMKC': 'WADMKC', 'WADMKD': 'WADMKD', 'KKOP_1': 'KKOP_1', 'LP2B_2': 'LP2B_2', 'KRB_03': 'KRB_03', 'TOD_04': 'TOD_04', 'TEB_05': 'TEB_05', 'PUSLIT': 'PUSLIT', 'CAGBUD': 'CAGBUD', 'RESAIR': 'RESAIR', 'KSMPDN': 'KSMPDN', 'HANKAM': 'HANKAM', 'KKARST': 'KKARST', 'PTBGMB': 'PTBGMB', 'MGRSAT': 'MGRSAT', 'RDBUMI': 'RDBUMI', 'TPZ_00': 'TPZ_00', 'REMARK': 'REMARK', 'LUASHA': 'LUASHA', 'Shape_Leng': 'Shape_Leng', 'Shape_Area': 'Shape_Area', 'PEMOHON': 'PEMOHON', });
lyr_LP2BLabuhanbatuUtara2023_5.set('fieldAliases', {'WADMKC': 'WADMKC', 'LUAS_LAHAN': 'LUAS_LAHAN', 'Source': 'Source', });
lyr_LP2BLabuhanbatu2023_6.set('fieldAliases', {'OBJECTID_1': 'OBJECTID_1', 'OBJECTID': 'OBJECTID', 'WADMPR': 'WADMPR', 'WADMKK': 'WADMKK', 'WADMKC': 'WADMKC', 'Qname2019': 'Qname2019', 'Qname2023': 'Qname2023', 'SUMBER': 'SUMBER', 'Luas_CEA': 'Luas_CEA', 'NO_HPRN': 'NO_HPRN', 'NO_HPRN1': 'NO_HPRN1', 'Qname_AA': 'Qname_AA', 'JNSLHN': 'JNSLHN', 'IR_TEK': 'IR_TEK', 'IR_NONTEK': 'IR_NONTEK', 'NON_IR': 'NON_IR', 'IP_LAHAN': 'IP_LAHAN', 'IP_PADI': 'IP_PADI', 'P_TANAM': 'P_TANAM', 'PROD': 'PROD', 'JUT': 'JUT', 'S_AIR': 'S_AIR', 'KET_TEG': 'KET_TEG', 'Qname23': 'Qname23', 'IRIGASI': 'IRIGASI', 'RANGE_PROD': 'RANGE_PROD', 'LP2B_1': 'LP2B_1', 'KOMBINASI': 'KOMBINASI', 'KET': 'KET', });
lyr_RTRWLABUHANBATUNo3Tahun2016_7.set('fieldAliases', {'STRING': 'STRING', 'TEXTSTRING': 'TEXTSTRING', 'TOPONIM': 'TOPONIM', 'POLA_RUANG': 'POLA_RUANG', 'LUAS_1': 'LUAS_1', });
lyr_RTRWLABUHANBATUUTARANo5Tahun2015_8.set('fieldAliases', {'POLA_RUANG': 'POLA_RUANG', 'luas': 'luas', });
lyr_KawasanHutanSK6609_9.set('fieldAliases', {'KODEPROV': 'KODEPROV', 'FUNGSIKWS': 'FUNGSIKWS', 'NOSKPNJK': 'NOSKPNJK', 'TGLSKPNJK': 'TGLSKPNJK', 'F_KK': 'F_KK', 'FUNGSI': 'FUNGSI', 'LUAS_HA': 'LUAS_HA', 'No_SK': 'No_SK', 'Tentang': 'Tentang', });
lyr_PIPPIB2025_10.set('fieldAliases', {'PIPPIB': 'PIPPIB', 'NAMOBJ': 'NAMOBJ', 'FCODE': 'FCODE', 'LCODE': 'LCODE', 'SRS_ID': 'SRS_ID', 'METADATA': 'METADATA', 'REMARK': 'REMARK', });
lyr_Komoditas_11.set('fieldAliases', {'PROPINSI': 'PROPINSI', 'KABUPATEN': 'KABUPATEN', 'NIB': 'NIB', 'TIPEHAK': 'TIPEHAK', 'LUASTERTUL': 'LUASTERTUL', 'LUASPETA': 'LUASPETA', 'PEMILIK': 'PEMILIK', 'TIPEPEMILI': 'TIPEPEMILI', 'GUNATANAHK': 'GUNATANAHK', 'GUNATANAHU': 'GUNATANAHU', 'TERPETAKAN': 'TERPETAKAN', 'KECAMATAN': 'KECAMATAN', 'DESA': 'DESA', 'NIBEL_NIB': 'NIBEL_NIB', 'NO_SK_HGU': 'NO_SK_HGU', 'NO_SU_PLL': 'NO_SU_PLL', 'NO_HAK': 'NO_HAK', 'MULAI_BERL': 'MULAI_BERL', 'BERAKHIR': 'BERAKHIR', 'BUKU_TANAH': 'BUKU_TANAH', 'SURAT_UKUR': 'SURAT_UKUR', 'BUKU_TAN_1': 'BUKU_TAN_1', 'SURAT_UK_1': 'SURAT_UK_1', 'STATUS_HAK': 'STATUS_HAK', 'Keterangan': 'Keterangan', });
lyr_Batas_Administrasi_12.set('fieldAliases', {'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', });
lyr_HGU_13.set('fieldAliases', {'PROPINSI': 'PROPINSI', 'KABUPATEN': 'KABUPATEN', 'NIB': 'NIB', 'TIPEHAK': 'TIPEHAK', 'LUASTERTUL': 'LUASTERTUL', 'LUASPETA': 'LUASPETA', 'PEMILIK': 'PEMILIK', 'TIPEPEMILI': 'TIPEPEMILI', 'GUNATANAHK': 'GUNATANAHK', 'GUNATANAHU': 'GUNATANAHU', 'TERPETAKAN': 'TERPETAKAN', 'KECAMATAN': 'KECAMATAN', 'DESA': 'DESA', 'NIBEL_NIB': 'NIBEL_NIB', 'NO_SK_HGU': 'NO_SK_HGU', 'NO_SU_PLL': 'NO_SU_PLL', 'NO_HAK': 'NO_HAK', 'MULAI_BERL': 'MULAI_BERL', 'BERAKHIR': 'BERAKHIR', 'BUKU_TANAH': 'BUKU_TANAH', 'SURAT_UKUR': 'SURAT_UKUR', 'BUKU_TAN_1': 'BUKU_TAN_1', 'SURAT_UK_1': 'SURAT_UK_1', 'STATUS_HAK': 'STATUS_HAK', 'Keterangan': 'Keterangan', });
lyr_PETA_14.set('fieldAliases', {'id': 'id', 'Peta': 'Peta', 'SK': 'SK', });
lyr_RDTR_KOTA_RANTAUPRAPAT_4.set('fieldImages', {'NAMOBJ': 'TextEdit', 'NAMZON': 'TextEdit', 'KODZON': 'TextEdit', 'NAMSZN': 'TextEdit', 'KODSZN': 'TextEdit', 'JNSRPR': 'TextEdit', 'KODEWP': 'TextEdit', 'KODSWP': 'TextEdit', 'KODBLK': 'TextEdit', 'KODSBL': 'TextEdit', 'WADMPR': 'TextEdit', 'WADMKK': 'TextEdit', 'WADMKC': 'TextEdit', 'WADMKD': 'TextEdit', 'KKOP_1': 'TextEdit', 'LP2B_2': 'TextEdit', 'KRB_03': 'TextEdit', 'TOD_04': 'TextEdit', 'TEB_05': 'TextEdit', 'PUSLIT': 'TextEdit', 'CAGBUD': 'TextEdit', 'RESAIR': 'TextEdit', 'KSMPDN': 'TextEdit', 'HANKAM': 'TextEdit', 'KKARST': 'TextEdit', 'PTBGMB': 'TextEdit', 'MGRSAT': 'TextEdit', 'RDBUMI': 'TextEdit', 'TPZ_00': 'TextEdit', 'REMARK': 'TextEdit', 'LUASHA': 'TextEdit', 'Shape_Leng': 'TextEdit', 'Shape_Area': 'TextEdit', 'PEMOHON': 'TextEdit', });
lyr_LP2BLabuhanbatuUtara2023_5.set('fieldImages', {'WADMKC': 'TextEdit', 'LUAS_LAHAN': 'TextEdit', 'Source': 'TextEdit', });
lyr_LP2BLabuhanbatu2023_6.set('fieldImages', {'OBJECTID_1': 'TextEdit', 'OBJECTID': 'TextEdit', 'WADMPR': 'TextEdit', 'WADMKK': 'TextEdit', 'WADMKC': 'TextEdit', 'Qname2019': 'TextEdit', 'Qname2023': 'TextEdit', 'SUMBER': 'TextEdit', 'Luas_CEA': 'TextEdit', 'NO_HPRN': 'TextEdit', 'NO_HPRN1': 'TextEdit', 'Qname_AA': 'TextEdit', 'JNSLHN': 'TextEdit', 'IR_TEK': 'TextEdit', 'IR_NONTEK': 'TextEdit', 'NON_IR': 'TextEdit', 'IP_LAHAN': 'TextEdit', 'IP_PADI': 'TextEdit', 'P_TANAM': 'TextEdit', 'PROD': 'TextEdit', 'JUT': 'TextEdit', 'S_AIR': 'TextEdit', 'KET_TEG': 'TextEdit', 'Qname23': 'TextEdit', 'IRIGASI': 'TextEdit', 'RANGE_PROD': 'TextEdit', 'LP2B_1': 'TextEdit', 'KOMBINASI': 'TextEdit', 'KET': 'TextEdit', });
lyr_RTRWLABUHANBATUNo3Tahun2016_7.set('fieldImages', {'STRING': 'TextEdit', 'TEXTSTRING': 'TextEdit', 'TOPONIM': 'TextEdit', 'POLA_RUANG': 'TextEdit', 'LUAS_1': 'TextEdit', });
lyr_RTRWLABUHANBATUUTARANo5Tahun2015_8.set('fieldImages', {'POLA_RUANG': 'TextEdit', 'luas': 'TextEdit', });
lyr_KawasanHutanSK6609_9.set('fieldImages', {'KODEPROV': 'TextEdit', 'FUNGSIKWS': 'TextEdit', 'NOSKPNJK': 'TextEdit', 'TGLSKPNJK': 'DateTime', 'F_KK': 'TextEdit', 'FUNGSI': 'TextEdit', 'LUAS_HA': 'TextEdit', 'No_SK': 'TextEdit', 'Tentang': 'TextEdit', });
lyr_PIPPIB2025_10.set('fieldImages', {'PIPPIB': 'TextEdit', 'NAMOBJ': 'TextEdit', 'FCODE': 'TextEdit', 'LCODE': 'TextEdit', 'SRS_ID': 'TextEdit', 'METADATA': 'TextEdit', 'REMARK': 'TextEdit', });
lyr_Komoditas_11.set('fieldImages', {'PROPINSI': 'TextEdit', 'KABUPATEN': 'TextEdit', 'NIB': 'TextEdit', 'TIPEHAK': 'TextEdit', 'LUASTERTUL': 'TextEdit', 'LUASPETA': 'TextEdit', 'PEMILIK': 'TextEdit', 'TIPEPEMILI': 'TextEdit', 'GUNATANAHK': 'TextEdit', 'GUNATANAHU': 'TextEdit', 'TERPETAKAN': 'TextEdit', 'KECAMATAN': 'TextEdit', 'DESA': 'TextEdit', 'NIBEL_NIB': 'TextEdit', 'NO_SK_HGU': 'TextEdit', 'NO_SU_PLL': 'TextEdit', 'NO_HAK': 'TextEdit', 'MULAI_BERL': 'DateTime', 'BERAKHIR': 'DateTime', 'BUKU_TANAH': 'TextEdit', 'SURAT_UKUR': 'TextEdit', 'BUKU_TAN_1': 'TextEdit', 'SURAT_UK_1': 'TextEdit', 'STATUS_HAK': 'TextEdit', 'Keterangan': 'TextEdit', });
lyr_Batas_Administrasi_12.set('fieldImages', {'LEFT_FID': 'TextEdit', 'RIGHT_FID': 'TextEdit', });
lyr_HGU_13.set('fieldImages', {'PROPINSI': 'TextEdit', 'KABUPATEN': 'TextEdit', 'NIB': 'TextEdit', 'TIPEHAK': 'TextEdit', 'LUASTERTUL': 'TextEdit', 'LUASPETA': 'TextEdit', 'PEMILIK': 'TextEdit', 'TIPEPEMILI': 'TextEdit', 'GUNATANAHK': 'TextEdit', 'GUNATANAHU': 'TextEdit', 'TERPETAKAN': 'TextEdit', 'KECAMATAN': 'TextEdit', 'DESA': 'TextEdit', 'NIBEL_NIB': 'TextEdit', 'NO_SK_HGU': 'TextEdit', 'NO_SU_PLL': 'TextEdit', 'NO_HAK': 'TextEdit', 'MULAI_BERL': 'DateTime', 'BERAKHIR': 'DateTime', 'BUKU_TANAH': 'TextEdit', 'SURAT_UKUR': 'TextEdit', 'BUKU_TAN_1': 'TextEdit', 'SURAT_UK_1': 'TextEdit', 'STATUS_HAK': 'TextEdit', 'Keterangan': 'TextEdit', });
lyr_PETA_14.set('fieldImages', {'id': 'TextEdit', 'Peta': 'ExternalResource', 'SK': 'ExternalResource', });
lyr_RDTR_KOTA_RANTAUPRAPAT_4.set('fieldLabels', {'NAMOBJ': 'inline label - visible with data', 'NAMZON': 'inline label - visible with data', 'KODZON': 'inline label - visible with data', 'NAMSZN': 'inline label - visible with data', 'KODSZN': 'inline label - visible with data', 'JNSRPR': 'inline label - visible with data', 'KODEWP': 'inline label - visible with data', 'KODSWP': 'inline label - visible with data', 'KODBLK': 'inline label - visible with data', 'KODSBL': 'inline label - visible with data', 'WADMPR': 'inline label - visible with data', 'WADMKK': 'inline label - visible with data', 'WADMKC': 'inline label - visible with data', 'WADMKD': 'inline label - visible with data', 'KKOP_1': 'inline label - visible with data', 'LP2B_2': 'inline label - visible with data', 'KRB_03': 'inline label - visible with data', 'TOD_04': 'inline label - visible with data', 'TEB_05': 'inline label - visible with data', 'PUSLIT': 'inline label - visible with data', 'CAGBUD': 'inline label - visible with data', 'RESAIR': 'inline label - visible with data', 'KSMPDN': 'inline label - visible with data', 'HANKAM': 'inline label - visible with data', 'KKARST': 'inline label - visible with data', 'PTBGMB': 'inline label - visible with data', 'MGRSAT': 'inline label - visible with data', 'RDBUMI': 'inline label - visible with data', 'TPZ_00': 'inline label - visible with data', 'REMARK': 'inline label - visible with data', 'LUASHA': 'inline label - visible with data', 'Shape_Leng': 'inline label - visible with data', 'Shape_Area': 'inline label - visible with data', 'PEMOHON': 'inline label - visible with data', });
lyr_LP2BLabuhanbatuUtara2023_5.set('fieldLabels', {'WADMKC': 'inline label - visible with data', 'LUAS_LAHAN': 'inline label - visible with data', 'Source': 'inline label - visible with data', });
lyr_LP2BLabuhanbatu2023_6.set('fieldLabels', {'OBJECTID_1': 'inline label - visible with data', 'OBJECTID': 'inline label - visible with data', 'WADMPR': 'inline label - visible with data', 'WADMKK': 'inline label - visible with data', 'WADMKC': 'inline label - visible with data', 'Qname2019': 'inline label - visible with data', 'Qname2023': 'inline label - visible with data', 'SUMBER': 'inline label - visible with data', 'Luas_CEA': 'inline label - visible with data', 'NO_HPRN': 'inline label - visible with data', 'NO_HPRN1': 'inline label - visible with data', 'Qname_AA': 'inline label - visible with data', 'JNSLHN': 'inline label - visible with data', 'IR_TEK': 'inline label - visible with data', 'IR_NONTEK': 'inline label - visible with data', 'NON_IR': 'inline label - visible with data', 'IP_LAHAN': 'inline label - visible with data', 'IP_PADI': 'inline label - visible with data', 'P_TANAM': 'inline label - visible with data', 'PROD': 'inline label - visible with data', 'JUT': 'inline label - visible with data', 'S_AIR': 'inline label - visible with data', 'KET_TEG': 'inline label - visible with data', 'Qname23': 'inline label - visible with data', 'IRIGASI': 'inline label - visible with data', 'RANGE_PROD': 'inline label - visible with data', 'LP2B_1': 'inline label - visible with data', 'KOMBINASI': 'inline label - visible with data', 'KET': 'inline label - visible with data', });
lyr_RTRWLABUHANBATUNo3Tahun2016_7.set('fieldLabels', {'STRING': 'inline label - visible with data', 'TEXTSTRING': 'inline label - visible with data', 'TOPONIM': 'inline label - visible with data', 'POLA_RUANG': 'inline label - visible with data', 'LUAS_1': 'inline label - visible with data', });
lyr_RTRWLABUHANBATUUTARANo5Tahun2015_8.set('fieldLabels', {'POLA_RUANG': 'inline label - visible with data', 'luas': 'inline label - visible with data', });
lyr_KawasanHutanSK6609_9.set('fieldLabels', {'KODEPROV': 'inline label - visible with data', 'FUNGSIKWS': 'inline label - visible with data', 'NOSKPNJK': 'inline label - visible with data', 'TGLSKPNJK': 'inline label - visible with data', 'F_KK': 'inline label - visible with data', 'FUNGSI': 'inline label - visible with data', 'LUAS_HA': 'inline label - visible with data', 'No_SK': 'inline label - visible with data', 'Tentang': 'inline label - visible with data', });
lyr_PIPPIB2025_10.set('fieldLabels', {'PIPPIB': 'inline label - visible with data', 'NAMOBJ': 'inline label - visible with data', 'FCODE': 'inline label - visible with data', 'LCODE': 'inline label - visible with data', 'SRS_ID': 'inline label - visible with data', 'METADATA': 'inline label - visible with data', 'REMARK': 'inline label - visible with data', });
lyr_Komoditas_11.set('fieldLabels', {'PROPINSI': 'hidden field', 'KABUPATEN': 'hidden field', 'NIB': 'hidden field', 'TIPEHAK': 'hidden field', 'LUASTERTUL': 'hidden field', 'LUASPETA': 'hidden field', 'PEMILIK': 'hidden field', 'TIPEPEMILI': 'hidden field', 'GUNATANAHK': 'inline label - visible with data', 'GUNATANAHU': 'hidden field', 'TERPETAKAN': 'hidden field', 'KECAMATAN': 'hidden field', 'DESA': 'hidden field', 'NIBEL_NIB': 'hidden field', 'NO_SK_HGU': 'hidden field', 'NO_SU_PLL': 'hidden field', 'NO_HAK': 'hidden field', 'MULAI_BERL': 'hidden field', 'BERAKHIR': 'hidden field', 'BUKU_TANAH': 'hidden field', 'SURAT_UKUR': 'hidden field', 'BUKU_TAN_1': 'hidden field', 'SURAT_UK_1': 'hidden field', 'STATUS_HAK': 'hidden field', 'Keterangan': 'hidden field', });
lyr_Batas_Administrasi_12.set('fieldLabels', {'LEFT_FID': 'inline label - visible with data', 'RIGHT_FID': 'inline label - visible with data', });
lyr_HGU_13.set('fieldLabels', {'PROPINSI': 'inline label - visible with data', 'KABUPATEN': 'inline label - visible with data', 'NIB': 'inline label - visible with data', 'TIPEHAK': 'inline label - visible with data', 'LUASTERTUL': 'inline label - visible with data', 'LUASPETA': 'inline label - visible with data', 'PEMILIK': 'inline label - visible with data', 'TIPEPEMILI': 'inline label - visible with data', 'GUNATANAHK': 'inline label - visible with data', 'GUNATANAHU': 'inline label - visible with data', 'TERPETAKAN': 'inline label - visible with data', 'KECAMATAN': 'inline label - visible with data', 'DESA': 'inline label - visible with data', 'NIBEL_NIB': 'inline label - visible with data', 'NO_SK_HGU': 'inline label - visible with data', 'NO_SU_PLL': 'inline label - visible with data', 'NO_HAK': 'inline label - visible with data', 'MULAI_BERL': 'inline label - visible with data', 'BERAKHIR': 'inline label - visible with data', 'BUKU_TANAH': 'hidden field', 'SURAT_UKUR': 'hidden field', 'BUKU_TAN_1': 'hidden field', 'SURAT_UK_1': 'hidden field', 'STATUS_HAK': 'hidden field', 'Keterangan': 'inline label - visible with data', });
lyr_PETA_14.set('fieldLabels', {'id': 'hidden field', 'Peta': 'no label', 'SK': 'inline label - visible with data', });
lyr_PETA_14.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});